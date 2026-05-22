import {
  NextRequest,
  NextResponse,
} from "next/server";

import { connectDB } from "@/lib/mongodb";

import Task from "@/lib/models/Task";

// UPDATE TASK
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

    const updatedTask =
      await Task.findByIdAndUpdate(
        id,
        body,
        {
          new: true,
        }
      );

    if (!updatedTask) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Task not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Task updated successfully",

        updatedTask,
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

// DELETE TASK
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

    const deletedTask =
      await Task.findByIdAndDelete(
        id
      );

    if (!deletedTask) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Task not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Task deleted successfully",
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