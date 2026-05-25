import {
  NextResponse,
} from "next/server";

import Attendance
from "@/lib/models/Attendance";

import { connectDB }
from "@/lib/mongodb";

// CREATE ATTENDANCE
export async function POST(
  req: Request
) {
  try {

    await connectDB();

    const body =
      await req.json();

    // CHECK TODAY
    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    const existing =
      await Attendance.findOne({
        employeeEmail:
          body.employeeEmail,

        createdAt: {
          $gte: today,
        },
      });

    if (existing) {

      return NextResponse.json({
        success: false,
        message:
          "Attendance already marked today",
      });
    }

    const attendance =
      await Attendance.create(
        body
      );

    return NextResponse.json({
      success: true,
      attendance,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      success: false,
    });
  }
}

// GET ATTENDANCE
export async function GET() {

  try {

    await connectDB();

    const attendances =
      await Attendance.find()
      .sort({
        createdAt: -1,
      });

    return NextResponse.json({
      success: true,
      attendances,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      success: false,
    });
  }
}