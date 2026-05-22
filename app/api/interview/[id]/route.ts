import {
  NextRequest,
  NextResponse,
} from "next/server";

import { connectDB } from "@/lib/mongodb";

import Interview from "@/lib/models/Interview";

// UPDATE
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

    const updatedInterview =
      await Interview.findByIdAndUpdate(
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
          "Interview updated successfully",

        updatedInterview,
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

// DELETE
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

    await Interview.findByIdAndDelete(
      id
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "Interview deleted successfully",
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