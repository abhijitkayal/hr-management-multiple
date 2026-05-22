import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Branch from "@/lib/models/Branch";
import User from "@/lib/models/User";

export async function GET() {
  try {
    await connectDB();

    const branches =
      await Branch.find().sort({
        createdAt: -1,
      });

    return NextResponse.json({
      success: true,
      data: branches,
    });
  } catch {
    return NextResponse.json({
      success: false,
    });
  }
}

export async function POST(
  request: Request
) {
  try {
    await connectDB();

    const body =
      await request.json();

    const branchName =
      body.branchName?.trim();

    const email =
      body.email?.trim();

    const password =
      body.password?.trim();

    const hrName =
      body.hrName?.trim();

    const managerName =
      body.managerName?.trim();

    if (
      !branchName ||
      !body.address?.trim()
    ) {
      return NextResponse.json({
        success: false,
        message:
          "Fill all required fields",
      });
    }

    const existing =
      await Branch.findOne({
        branchName,
      });

    if (existing) {
      return NextResponse.json({
        success: false,
        message:
          "Branch already exists",
      });
    }

    if (email) {
      const existingUser =
        await User.findOne({
          email,
        });

      if (existingUser) {
        return NextResponse.json({
          success: false,
          message:
            "User already exists",
        });
      }
    }

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    const created =
      await Branch.create({
        ...body,
        branchName,
        email,
        password,
        managerName,
        hrName,
      });

    const userName =
      hrName ||
      managerName ||
      branchName;

    try {
      await User.create({
        name: userName,
        email,
        password,
        role: "hr",
        branch: created._id,
        branchName,
        avatar: userName
          .split(" ")
          .map((word: string) => word[0])
          .join("")
          .toUpperCase(),
      });
    } catch (userError: unknown) {
      await Branch.deleteOne({
        _id: created._id,
      });

      return NextResponse.json({
        success: false,
        message:
          userError instanceof Error
            ? userError.message
            : "Failed to create linked user",
      });
    }

    return NextResponse.json({
      success: true,
      data: created,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong";

    return NextResponse.json({
      success: false,
      message,
    });
  }
}