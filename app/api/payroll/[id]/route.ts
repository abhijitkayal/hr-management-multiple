import {
  NextRequest,
  NextResponse,
} from "next/server";

import { connectDB } from "@/lib/mongodb";

import Payroll from "@/lib/models/Payroll";

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

    const updatedPayroll =
      await Payroll.findByIdAndUpdate(
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
          "Payroll updated successfully",

        updatedPayroll,
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

    await Payroll.findByIdAndDelete(
      id
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "Payroll deleted successfully",
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