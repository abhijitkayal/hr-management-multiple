import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";

import Employee from "@/lib/models/Employees";
import HR from "@/lib/models/User";
import { connectDB } from "@/lib/mongodb";

type ForgotPasswordBody = {
  email?: string;
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = (await req.json()) as ForgotPasswordBody;
    const email = body.email?.trim();

    if (!email) {
      return NextResponse.json({
        success: false,
        message: "Email is required",
      });
    }

    const employee = await Employee.findOne({
      email: { $regex: `^${escapeRegExp(email)}$`, $options: "i" },
    });

    const hr = employee
      ? null
      : await HR.findOne({
          email: { $regex: `^${escapeRegExp(email)}$`, $options: "i" },
        });

    const account = employee || hr;

    if (!account) {
      return NextResponse.json({
        success: false,
        message: "Email not found",
      });
    }

    const isEmployee = Boolean(employee);
    const resetToken = crypto.randomBytes(32).toString("hex");
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetPath = isEmployee
      ? `/employee-reset-password/${resetToken}`
      : `/hr-reset-password/${resetToken}`;
    const resetLink = `${baseUrl}${resetPath}`;

    account.resetToken = resetToken;
    account.resetTokenExpiry = Date.now() + 1000 * 60 * 15;

    await account.save({ validateBeforeSave: false });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: isEmployee ? "Employee Password Reset" : "HR Password Reset",
      html: `
        <div style="font-family:Arial;padding:20px">
          <h2>Reset Password</h2>
          <p>Click below button to reset your ${isEmployee ? "employee" : "HR"} password.</p>
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
          <p style="margin-top:20px;color:gray">Link expires in 15 minutes</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Reset link sent",
      role: isEmployee ? "employee" : "hr",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}
