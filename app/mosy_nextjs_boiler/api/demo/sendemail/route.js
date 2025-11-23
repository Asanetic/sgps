// app/api/sendMail/route.js

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let body;
    let isMultipart = false;
    
    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await request.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await request.json();
    }
    const {
      txt_message_details: message,
      txt_receiver_email: recipient,
      txt_subject: subject,
    } = body;

    if (!recipient || !subject || !message) {
      return NextResponse.json({ success: false, message: 'Missing email, subject, or message.' }, { status: 400 });
    }

    // Configure Gmail transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'spectrabill@gmail.com',
        pass: 'hzti bulj belm tqdt', // ✅ Gmail App Password
      },
    });

    // Send the actual email
    const info = await transporter.sendMail({
      from: '"Spectra Bill" <spectrabill@gmail.com>',
      to: recipient,
      subject,
      text: message, // plain text
      html: `<p>${message.replace(/\n/g, '<br/>')}</p>`, // basic HTML
    });

    console.log('📨 Email sent:', info.messageId);
    return NextResponse.json({ success: true, message: 'Email sent successfully!' });
  } catch (err) {
    console.error('❌ Email send failed:', err);
    return NextResponse.json({ success: false, message: 'Email failed to send.', error: err.message }, { status: 500 });
  }
}
