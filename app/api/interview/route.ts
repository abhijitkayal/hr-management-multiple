import {
  NextRequest,
  NextResponse,
} from "next/server";

import { connectDB } from "@/lib/mongodb";

import Interview from "@/lib/models/Interview";

// CREATE INTERVIEW
export async function POST(
  req: NextRequest
) {
  try {
    await connectDB();

    const body = await req.json();

    const interview =
      await Interview.create(
        body
      );

    return NextResponse.json(
      {
        success: true,
        message:
          "Interview created successfully",

        interview,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}

// GET INTERVIEWS
export async function GET() {
  try {
    await connectDB();

    const interviews =
      await Interview.find().sort({
        createdAt: -1,
      });

    return NextResponse.json(
      {
        success: true,
        interviews,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}