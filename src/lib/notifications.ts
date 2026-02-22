import { Resend } from "resend";

export async function sendDiscoveryBookingEmail(
  name: string,
  date: string,
  time: string,
) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "9BallShop <orders@9ballshop.com>";
  if (!apiKey) {
    console.warn(
      "RESEND_API_KEY not set, skipping discovery booking email",
    );
    return;
  }

  const resend = new Resend(apiKey);

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
      <div style="background:#1a1a2e;padding:24px;text-align:center;">
        <h1 style="color:#d4af37;margin:0;font-size:24px;">9BallShop</h1>
      </div>
      <div style="padding:24px;">
        <h2 style="color:#1a1a2e;">New Discovery Call Booking</h2>
        <div style="background:#f9f9f9;padding:16px;border-radius:8px;margin:16px 0;">
          <p style="margin:0 0 8px;"><strong>Name:</strong> ${name || "Not provided"}</p>
          <p style="margin:0 0 8px;"><strong>Date:</strong> ${date}</p>
          <p style="margin:0;"><strong>Time:</strong> ${time}</p>
        </div>
        <p style="color:#888;font-size:14px;">Someone just booked a free discovery call through the website.</p>
      </div>
      <div style="background:#f5f5f5;padding:16px;text-align:center;font-size:12px;color:#999;">
        9BallShop &mdash; Premium Billiards Equipment
      </div>
    </div>
  `;

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: "komninakis1991@gmail.com",
      subject: `New Discovery Call: ${name || "Anonymous"} — ${date} at ${time}`,
      html,
    });
    console.log("Resend booking email result:", JSON.stringify(result));
  } catch (err) {
    console.error("Failed to send discovery booking email:", err);
  }
}

export async function sendDiscoveryBookingConfirmationEmail(
  toEmail: string,
  name: string,
  date: string,
  time: string,
  locale: string,
) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "9BallShop <orders@9ballshop.com>";
  if (!apiKey) {
    console.warn(
      "RESEND_API_KEY not set, skipping confirmation email",
    );
    return;
  }

  const resend = new Resend(apiKey);

  const isGreek = locale === "el";
  const displayName = name || (isGreek ? "φίλε" : "there");

  const subject = isGreek
    ? `Επιβεβαίωση Discovery Call — ${date} στις ${time}`
    : `Discovery Call Confirmed — ${date} at ${time}`;

  const html = isGreek
    ? `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
      <div style="background:#1a1a2e;padding:24px;text-align:center;">
        <h1 style="color:#d4af37;margin:0;font-size:24px;">9BallShop</h1>
      </div>
      <div style="padding:24px;">
        <h2 style="color:#1a1a2e;">Το Discovery Call σου επιβεβαιώθηκε!</h2>
        <p>Γεια σου ${displayName},</p>
        <p>Ευχαριστώ που έκλεισες ένα δωρεάν discovery call. Εδώ είναι τα στοιχεία:</p>
        <div style="background:#f9f9f9;padding:16px;border-radius:8px;margin:16px 0;">
          <p style="margin:0 0 8px;"><strong>Ημερομηνία:</strong> ${date}</p>
          <p style="margin:0;"><strong>Ώρα:</strong> ${time}</p>
        </div>
        <p>Θα επικοινωνήσω μαζί σου μέσω Instagram για να επιβεβαιώσουμε τις λεπτομέρειες. Αν χρειαστεί να αλλάξεις ώρα, στείλε μου μήνυμα στο <a href="https://ig.me/m/komninakis.m" style="color:#d4af37;">Instagram</a>.</p>
        <p>Ανυπομονώ!</p>
        <p>Μάριος Κομνηνάκης</p>
      </div>
      <div style="background:#f5f5f5;padding:16px;text-align:center;font-size:12px;color:#999;">
        9BallShop &mdash; Premium Billiards Equipment
      </div>
    </div>
    `
    : `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
      <div style="background:#1a1a2e;padding:24px;text-align:center;">
        <h1 style="color:#d4af37;margin:0;font-size:24px;">9BallShop</h1>
      </div>
      <div style="padding:24px;">
        <h2 style="color:#1a1a2e;">Your Discovery Call is Confirmed!</h2>
        <p>Hey ${displayName},</p>
        <p>Thanks for booking a free discovery call. Here are the details:</p>
        <div style="background:#f9f9f9;padding:16px;border-radius:8px;margin:16px 0;">
          <p style="margin:0 0 8px;"><strong>Date:</strong> ${date}</p>
          <p style="margin:0;"><strong>Time:</strong> ${time}</p>
        </div>
        <p>I'll reach out to you via Instagram to confirm the details. If you need to reschedule, send me a message on <a href="https://ig.me/m/komninakis.m" style="color:#d4af37;">Instagram</a>.</p>
        <p>Looking forward to it!</p>
        <p>Marios Komninakis</p>
      </div>
      <div style="background:#f5f5f5;padding:16px;text-align:center;font-size:12px;color:#999;">
        9BallShop &mdash; Premium Billiards Equipment
      </div>
    </div>
    `;

  try {
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject,
      html,
    });
  } catch (err) {
    console.error("Failed to send confirmation email:", err);
  }
}

export async function sendTelegramNotification(message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) {
    console.warn(
      "TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set, skipping Telegram notification",
    );
    return;
  }

  try {
    await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      },
    );
  } catch (err) {
    console.error("Failed to send Telegram notification:", err);
  }
}
