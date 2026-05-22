import {
  NextRequest,
  NextResponse,
} from "next/server";

import { connectDB } from "@/lib/mongodb";

import Payroll from "@/lib/models/Payroll";

// CREATE PAYROLL
export async function POST(
  req: NextRequest
) {
  try {
    await connectDB();

    const body = await req.json();

    const payroll =
      await Payroll.create(body);

    return NextResponse.json(
      {
        success: true,
        message:
          "Payroll created successfully",

        payroll,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("/api/payroll error:", error);

    // If it's a Mongoose validation error, return 400 with details
    // so clients get useful feedback instead of a generic 500.
    // Fallback to 500 for unexpected errors.
    if ((error as any)?.name === "ValidationError") {
      return NextResponse.json(
        {
          success: false,
          message: (error as any).message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}

// GET PAYROLLS
export async function GET() {
  try {
    await connectDB();

    const payrolls =
      await Payroll.find().sort({
        createdAt: -1,
      });

    return NextResponse.json(
      {
        success: true,
        payrolls,
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