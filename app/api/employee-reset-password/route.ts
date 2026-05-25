import { NextResponse } from "next/server";

import Employee from "@/lib/models/Employees";

import { connectDB } from "@/lib/mongodb";

export async function POST(
  req: Request
) {
  try {
    await connectDB();

    const body =
      await req.json();

    const {
      token,
      password,
    } = body;

    const employee =
      await Employee.findOne({
        resetToken: token,

        resetTokenExpiry: {
          $gt: Date.now(),
        },
      });

    if (!employee) {
      return NextResponse.json({
        success: false,
        message:
          "Invalid or expired token",
      });
    }

    // UPDATE PASSWORD
    employee.password =
      password;

    // CLEAR TOKEN
    employee.resetToken =
      undefined;

    employee.resetTokenExpiry =
      undefined;

    // IMPORTANT FIX
    await employee.save({
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