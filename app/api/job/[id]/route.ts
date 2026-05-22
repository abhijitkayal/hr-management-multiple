import {
  NextRequest,
  NextResponse,
} from "next/server";

import { connectDB } from "@/lib/mongodb";

import Job from "@/lib/models/Job";

// UPDATE JOB
export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    await connectDB();

    const body = await req.json();

    const { id } =
      await params;

    const updatedJob =
      await Job.findByIdAndUpdate(
        id,
        body,
        {
          new: true,
        }
      );

    return NextResponse.json(
      {
        success: true,
        message:
          "Job updated successfully",

        updatedJob,
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

// DELETE JOB
export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    await connectDB();

    const { id } =
      await params;

    await Job.findByIdAndDelete(
      id
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "Job deleted successfully",
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