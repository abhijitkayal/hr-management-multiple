import {
  NextRequest,
  NextResponse,
} from "next/server";

import { connectDB } from "@/lib/mongodb";

import Training from "@/lib/models/Training";

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

    const updatedTraining =
      await Training.findByIdAndUpdate(
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
          "Training updated successfully",

        updatedTraining,
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

    await Training.findByIdAndDelete(
      id
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "Training deleted successfully",
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