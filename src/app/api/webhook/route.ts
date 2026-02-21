import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getPrisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 },
    );
  }

  const stripe = new Stripe(secretKey, {
    httpClient: Stripe.createFetchHttpClient(),
  });
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.metadata?.type === "membership") {
        await handleMembershipCheckout(session);
      } else {
        await handleCheckoutCompleted(stripe, session);
      }
      break;
    }
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionUpdated(subscription);
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionDeleted(subscription);
      break;
    }
    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      await handleInvoicePaymentSucceeded(invoice);
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      await handleInvoicePaymentFailed(invoice);
      break;
    }
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
) {
  const prisma = await getPrisma();

  // Skip if order already exists (idempotency)
  const existing = await prisma.order.findUnique({
    where: { stripeSessionId: session.id },
  });
  if (existing) return;

  // Retrieve line items from Stripe
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

  const metadata = session.metadata || {};
  const customerEmail =
    session.customer_details?.email || metadata.customer_email || "";

  // Separate product items from shipping
  const productItems = lineItems.data.filter(
    (item) => item.description !== "Shipping",
  );
  const shippingLineItem = lineItems.data.find(
    (item) => item.description === "Shipping",
  );

  const subtotal = productItems.reduce(
    (sum, item) => sum + (item.amount_total || 0),
    0,
  );
  const shippingCost = shippingLineItem
    ? (shippingLineItem.amount_total || 0) / 100
    : 0;

  const items = productItems.map((item) => ({
    name: item.description || "Unknown item",
    quantity: item.quantity || 1,
    amount: item.amount_total || 0,
  }));

  const userId = metadata.user_id ? parseInt(metadata.user_id, 10) : null;

  const order = await prisma.order.create({
    data: {
      userId: userId || undefined,
      stripeSessionId: session.id,
      stripePaymentIntentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : "",
      status: "paid",
      items: JSON.stringify(items),
      subtotal: subtotal / 100,
      shippingCost,
      total: (session.amount_total || 0) / 100,
      customerEmail,
      shippingName: metadata.shipping_name || "",
      shippingPhone: metadata.shipping_phone || "",
      shippingStreet: metadata.shipping_street || "",
      shippingCity: metadata.shipping_city || "",
      shippingPostalCode: metadata.shipping_postal_code || "",
      shippingCountry: metadata.shipping_country || "",
    },
  });

  // Send confirmation email
  if (customerEmail) {
    await sendOrderConfirmationEmail({
      customerEmail,
      customerName: metadata.shipping_name || "",
      orderId: order.id,
      items,
      subtotal: subtotal / 100,
      shippingCost,
      total: (session.amount_total || 0) / 100,
      shippingAddress: {
        street: metadata.shipping_street || "",
        city: metadata.shipping_city || "",
        postalCode: metadata.shipping_postal_code || "",
        country: metadata.shipping_country || "",
      },
    });
  }
}

async function handleMembershipCheckout(session: Stripe.Checkout.Session) {
  const prisma = await getPrisma();
  const userId = session.metadata?.user_id
    ? parseInt(session.metadata.user_id, 10)
    : null;
  if (!userId) return;

  const subscriptionId =
    typeof session.subscription === "string" ? session.subscription : "";

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 31);

  await prisma.user.update({
    where: { id: userId },
    data: {
      membershipStatus: "active",
      membershipExpiresAt: expiresAt,
      stripeSubscriptionId: subscriptionId,
      stripeCustomerId:
        typeof session.customer === "string" ? session.customer : undefined,
    },
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const prisma = await getPrisma();

  const user = await prisma.user.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  });
  if (!user) return;

  const statusMap: Record<string, string> = {
    active: "active",
    past_due: "past_due",
    canceled: "cancelled",
    unpaid: "past_due",
    trialing: "active",
    incomplete: "none",
    incomplete_expired: "none",
    paused: "cancelled",
  };

  const membershipStatus = statusMap[subscription.status] || "none";

  await prisma.user.update({
    where: { id: user.id },
    data: { membershipStatus },
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const prisma = await getPrisma();

  const user = await prisma.user.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  });
  if (!user) return;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      membershipStatus: "cancelled",
    },
  });
}

function getSubscriptionIdFromInvoice(invoice: Stripe.Invoice): string | null {
  const sub = invoice.parent?.subscription_details?.subscription;
  if (!sub) return null;
  return typeof sub === "string" ? sub : sub.id;
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = getSubscriptionIdFromInvoice(invoice);
  if (!subscriptionId) return;

  const prisma = await getPrisma();

  const user = await prisma.user.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
  });
  if (!user) return;

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 31);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      membershipStatus: "active",
      membershipExpiresAt: expiresAt,
    },
  });
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = getSubscriptionIdFromInvoice(invoice);
  if (!subscriptionId) return;

  const prisma = await getPrisma();

  const user = await prisma.user.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
  });
  if (!user) return;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      membershipStatus: "past_due",
    },
  });
}
