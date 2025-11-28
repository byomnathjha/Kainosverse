import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Small helper to escape HTML
function escapeHtml(str: string) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Basic validation
    if (!body?.student_name || !body?.email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Read environment variables
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    const primaryRecipient = process.env.EMAIL_TO || user;

    if (!user || !pass) {
      console.error("Missing EMAIL_USER or EMAIL_PASS environment variables.");
      return NextResponse.json({ error: "Mail server not configured" }, { status: 500 });
    }

    // 🌟 Define all recipients, including the new ones 🌟
    const newRecipients = "kainosverse@gmail.com, sohrabalam8159@gmail.com";
    
    // Combine all recipients into a single comma-separated string
    const allRecipients = `${primaryRecipient}, ${newRecipients}`;

    // Debugging log for Vercel
    console.log("EMAIL_USER exists:", !!process.env.EMAIL_USER);
    console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    // Optional verification (can fail on Vercel, but won't break)
    try {
      await transporter.verify();
      console.log("SMTP transporter verified");
    } catch (verifyErr) {
      console.warn("SMTP verification warning (non-fatal):", verifyErr);
    }

    const mailOptions = {
      from: user,
      // 🚀 Use the combined list of recipients here 🚀
      to: allRecipients, 
      subject: "New Student Registration",
      html: `
        <h2>New Registration Details</h2>
        <p><strong>Name:</strong> ${escapeHtml(body.student_name)}</p>
        <p><strong>Class:</strong> ${escapeHtml(body.class_standard || "")}</p>
        <p><strong>Contact:</strong> ${escapeHtml(body.contact_number || "")}</p>
        <p><strong>Email:</strong> ${escapeHtml(body.email)}</p>
        <p><strong>School:</strong> ${escapeHtml(body.school_name || "")}</p>
        <p><strong>Group:</strong> ${escapeHtml(body.group || "")}</p>
        <p><strong>Idea:</strong> ${escapeHtml((body.idea || "").toString()).replace(/\n/g, "<br>")}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Email sending failed:", error);
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 });
  }
}