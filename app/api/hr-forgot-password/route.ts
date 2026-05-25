import { NextResponse } from "next/server";

import crypto from "crypto";

import nodemailer from "nodemailer";

import HR from "@/lib/models/User";

import { connectDB } from "@/lib/mongodb";

export async function POST(
  req: Request
) {
  try {
    await connectDB();

    const body =
      await req.json();

    const { email } = body;

    const hr =
      await HR.findOne({
        email,
      });

    if (!hr) {
      return NextResponse.json({
        success: false,
        message:
          "HR not found",
      });
    }

    // TOKEN
    const resetToken =
      crypto
        .randomBytes(32)
        .toString("hex");

    hr.resetToken =
      resetToken;

    hr.resetTokenExpiry =
      Date.now() +
      1000 * 60 * 15;

    await hr.save({
      validateBeforeSave: false,
    });

    // RESET LINK
    const resetLink = `http://localhost:3000/hr-reset-password/${resetToken}`;

    // MAIL
    const transporter =
      nodemailer.createTransport({
        service: "gmail",

        auth: {
          user:
            process.env.EMAIL_USER,

          pass:
            process.env.EMAIL_PASS,
        },
      });

    await transporter.sendMail({
      from:
        process.env.EMAIL_USER,

      to: email,

      subject:
        "HR Password Reset",

      html: `
        <div style="font-family:Arial;padding:20px">

          <h2>
            Reset Password
          </h2>

          <p>
            Click below button to reset your HR password.
          </p>

          <a
            href="${resetLink}"
            style="
              background:black;
              color:white;
              padding:12px 20px;
              border-radius:8px;
              text-decoration:none;
              display:inline-block;
              margin-top:10px;
            "
          >
            Reset Password
          </a>

          <p style="margin-top:20px;color:gray">
            Link expires in 15 minutes
          </p>

        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message:
        "Reset link sent",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
      message:
        "Server error",
    });
  }
}