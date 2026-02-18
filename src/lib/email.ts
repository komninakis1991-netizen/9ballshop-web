import { Resend } from "resend";

interface OrderItem {
  name: string;
  quantity: number;
  amount: number; // in cents
}

interface OrderEmailData {
  customerEmail: string;
  customerName: string;
  orderId: number;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set, skipping order confirmation email");
    return;
  }

  const resend = new Resend(apiKey);

  const itemRows = data.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee;">${item.name}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">&euro;${(item.amount / 100).toFixed(2)}</td>
        </tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
      <div style="background:#1a1a2e;padding:24px;text-align:center;">
        <h1 style="color:#d4af37;margin:0;font-size:24px;">9BallShop</h1>
      </div>
      <div style="padding:24px;">
        <h2 style="color:#1a1a2e;">Order Confirmation</h2>
        <p>Hi ${data.customerName || "there"},</p>
        <p>Thank you for your order! Here's your receipt:</p>
        <p style="color:#888;font-size:14px;">Order #${data.orderId}</p>

        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <thead>
            <tr style="border-bottom:2px solid #1a1a2e;">
              <th style="text-align:left;padding:8px 0;">Item</th>
              <th style="text-align:center;padding:8px 0;">Qty</th>
              <th style="text-align:right;padding:8px 0;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows}
          </tbody>
        </table>

        <table style="width:100%;margin:16px 0;">
          <tr>
            <td style="padding:4px 0;color:#888;">Subtotal</td>
            <td style="padding:4px 0;text-align:right;">&euro;${data.subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#888;">Shipping</td>
            <td style="padding:4px 0;text-align:right;">&euro;${data.shippingCost.toFixed(2)}</td>
          </tr>
          <tr style="border-top:2px solid #1a1a2e;">
            <td style="padding:8px 0;font-weight:bold;font-size:18px;">Total</td>
            <td style="padding:8px 0;text-align:right;font-weight:bold;font-size:18px;color:#d4af37;">&euro;${data.total.toFixed(2)}</td>
          </tr>
        </table>

        <div style="background:#f9f9f9;padding:16px;border-radius:8px;margin:16px 0;">
          <p style="margin:0 0 8px;font-weight:bold;">Shipping to:</p>
          <p style="margin:0;color:#555;">
            ${data.shippingAddress.street}<br/>
            ${data.shippingAddress.city}, ${data.shippingAddress.postalCode}<br/>
            ${data.shippingAddress.country === "GR" ? "Greece" : data.shippingAddress.country}
          </p>
        </div>

        <p style="color:#888;font-size:14px;">We'll notify you when your order ships. If you have any questions, reply to this email.</p>
      </div>
      <div style="background:#f5f5f5;padding:16px;text-align:center;font-size:12px;color:#999;">
        9BallShop &mdash; Premium Billiards Equipment
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "9BallShop <orders@9ballshop.com>",
      to: data.customerEmail,
      subject: `Order Confirmation #${data.orderId} - 9BallShop`,
      html,
    });
  } catch (err) {
    console.error("Failed to send order confirmation email:", err);
  }
}

export async function sendOrderShippedEmail(
  customerEmail: string,
  customerName: string,
  orderId: number,
) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set, skipping shipped email");
    return;
  }

  const resend = new Resend(apiKey);

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
      <div style="background:#1a1a2e;padding:24px;text-align:center;">
        <h1 style="color:#d4af37;margin:0;font-size:24px;">9BallShop</h1>
      </div>
      <div style="padding:24px;">
        <h2 style="color:#1a1a2e;">Your Order Has Shipped!</h2>
        <p>Hi ${customerName || "there"},</p>
        <p>Great news! Your order <strong>#${orderId}</strong> has been shipped and is on its way to you.</p>
        <p style="color:#888;font-size:14px;">If you have any questions, reply to this email.</p>
      </div>
      <div style="background:#f5f5f5;padding:16px;text-align:center;font-size:12px;color:#999;">
        9BallShop &mdash; Premium Billiards Equipment
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "9BallShop <orders@9ballshop.com>",
      to: customerEmail,
      subject: `Order #${orderId} Shipped - 9BallShop`,
      html,
    });
  } catch (err) {
    console.error("Failed to send order shipped email:", err);
  }
}
