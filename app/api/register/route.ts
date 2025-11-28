// app/api/register/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Basic validation
    if (!body?.student_name || !body?.email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    const recipient = process.env.EMAIL_TO || process.env.EMAIL_USER;

    if (!user || !pass) {
      console.error("Missing EMAIL_USER or EMAIL_PASS environment variables.");
      return NextResponse.json({ error: "Mail server not configured" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass, // use an App Password for Gmail (with 2FA enabled)
      },
    });

    // Optional verify (helps debugging)
    try {
      await transporter.verify();
      console.log("SMTP transporter verified");
    } catch (verifyErr) {
      console.warn("SMTP verification warning:", verifyErr);
    }

    const mailOptions = {
      from: user,
      to: recipient,
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

    return NextResponse.json({ message: "Email sent" }, { status: 200 });
  } catch (error: any) {
    console.error("Email sending failed:", error);
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 });
  }
}

// small helper to avoid basic injection into HTML
function escapeHtml(str: string) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
