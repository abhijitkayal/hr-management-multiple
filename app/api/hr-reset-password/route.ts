import { NextResponse } from "next/server";

import HR from "@/lib/models/User";

import { connectDB } from "@/lib/mongodb";

export async function POST(
  req: Request
) {
  try {
    await connectDB();

    const body =
      await req.json();

    const token =
      body.token?.trim();

    const password =
      body.password;

    console.log(
      "TOKEN:",
      token
    );

    const hr =
      await HR.findOne({
        resetToken: token,
      });

    console.log(
      "FOUND HR:",
      hr
    );

    if (!hr) {
      return NextResponse.json({
        success: false,
        message:
          "Invalid token",
      });
    }

    // CHECK EXPIRY
    if (
      hr.resetTokenExpiry <
      new Date()
    ) {
      return NextResponse.json({
        success: false,
        message:
          "Token expired",
      });
    }

    // UPDATE PASSWORD
    hr.password =
      password;

    // CLEAR TOKEN
    hr.resetToken =
      undefined;

    hr.resetTokenExpiry =
      undefined;

    await hr.save({
      validateBeforeSave: false,
    });

    return NextResponse.json({
      success: true,
      message:
        "Password reset successful",
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