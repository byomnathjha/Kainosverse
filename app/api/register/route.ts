import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER as string,
        pass: process.env.EMAIL_PASS as string,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER as string,
      to: process.env.EMAIL_TO as string,
      subject: "New Student Registration",
      html: `
        <h2>New Registration Details</h2>
        <p><strong>Name:</strong> ${body.student_name}</p>
        <p><strong>Class:</strong> ${body.class_standard}</p>
        <p><strong>Contact:</strong> ${body.contact_number}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>School:</strong> ${body.school_name}</p>
        <p><strong>Group:</strong> ${body.group}</p>
        <p><strong>Idea:</strong> ${body.idea}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Email sent!" }, { status: 200 });
  } catch (error: any) {
    console.error("Email sending failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
