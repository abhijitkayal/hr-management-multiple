import {
  NextRequest,
  NextResponse,
} from "next/server";

import { connectDB } from "@/lib/mongodb";

import Employee from "@/lib/models/Employees";

// DELETE EMPLOYEE
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

    // AWAIT PARAMS
    const { id } =
      await params;

    console.log(id);

    const deletedEmployee =
      await Employee.findByIdAndDelete(
        id
      );

    if (!deletedEmployee) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Employee not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Employee deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Delete failed",
      },
      { status: 500 }
    );
  }
}

// UPDATE EMPLOYEE
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

    // AWAIT PARAMS
    const { id } =
      await params;

    const body =
      await req.json();

    const updatedEmployee =
      await Employee.findByIdAndUpdate(
        id,
        body,
        {
          new: true,
        }
      );

    if (!updatedEmployee) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Employee not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Employee updated successfully",

        employee:
          updatedEmployee,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Update failed",
      },
      { status: 500 }
    );
  }
}