import {
  NextResponse,
} from "next/server";

import AttendanceProfile
from "@/lib/models/AttendanceProfile";

import { connectDB }
from "@/lib/mongodb";

// SAVE PROFILE
export async function POST(
  req: Request
) {
  try {

    await connectDB();

    const body =
      await req.json();

    const existing =
      await AttendanceProfile.findOne({
        employeeEmail:
          body.employeeEmail,
      });

    if (existing) {

      return NextResponse.json({
        success: true,
        profile: existing,
      });
    }

    const profile =
      await AttendanceProfile.create(
        body
      );

    return NextResponse.json({
      success: true,
      profile,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      success: false,
    });
  }
}

// GET PROFILE
export async function GET(
  req: Request
) {
  try {

    await connectDB();

    const {
      searchParams,
    } = new URL(req.url);

    const email =
      searchParams.get(
        "email"
      );

    const profile =
      await AttendanceProfile.findOne({
        employeeEmail:
          email,
      });

    return NextResponse.json({
      success: true,
      profile,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      success: false,
    });
  }
}