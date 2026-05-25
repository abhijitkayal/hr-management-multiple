import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Branch from "@/lib/models/Branch";
import User from "@/lib/models/User";

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const branchName = searchParams.get("branchName")?.trim();

    if (!branchName) {
      return NextResponse.json({
        success: false,
        message: "Branch name is required",
      });
    }

    const branch = await Branch.findOne({
      branchName,
    });

    if (!branch) {
      return NextResponse.json({
        success: false,
        message: "Branch not found",
      });
    }

    const hrUser = await User.findOne({
      role: "hr",
      branch: branch._id,
    }).select("_id");

    const fallbackUser = hrUser
      ? null
      : await User.findOne({
          role: "hr",
          branchName,
        }).select("_id");

    const hrUserId = String(
      hrUser?._id || fallbackUser?._id || ""
    );

    if (!hrUserId) {
      return NextResponse.json({
        success: false,
        message: "HR profile not linked to this branch",
      });
    }

    return NextResponse.json({
      success: true,
      hrUserId,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
      message: "Something went wrong",
    });
  }
}