import {
  NextRequest,
  NextResponse,
} from "next/server";

import { connectDB } from "@/lib/mongodb";

import Job from "@/lib/models/Job";

// CREATE JOB
export async function POST(
  req: NextRequest
) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      title,
      department,
      type,
      closingDate,
      salary,
      experience,
      interviewType,
      description,
      branchName,
      createdBy,
    } = body;

    // AUTO STATUS
    const today =
      new Date();

    const closeDate =
      new Date(closingDate);

    const status =
      closeDate < today
        ? "Closed"
        : "Open";

    const job =
      await Job.create({
        title,
        department,
        type,
        closingDate,
        salary,
        experience,
        interviewType,
        description,
        branchName,
        createdBy,
        status,
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Job posted successfully",

        job,
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

// GET JOBS
export async function GET() {
  try {
    await connectDB();

    // AUTO UPDATE CLOSED STATUS
    const today =
      new Date();

    await Job.updateMany(
      {
        closingDate: {
          $lt: today,
        },
      },
      {
        status: "Closed",
      }
    );

    const jobs =
      await Job.find().sort({
        createdAt: -1,
      });

    return NextResponse.json(
      {
        success: true,
        jobs,
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