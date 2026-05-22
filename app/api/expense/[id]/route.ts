import {
  NextRequest,
  NextResponse,
} from "next/server";

import { connectDB } from "@/lib/mongodb";

import Expense from "@/lib/models/Expense";

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

    const {
      totalAmount,
      paidAmount,
    } = body;

    // VALIDATION
    if (
      Number(paidAmount) >
      Number(totalAmount)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Paid amount cannot be greater than total amount",
        },
        { status: 400 }
      );
    }

    // CALCULATE
    const dueAmount =
      Number(totalAmount) -
      Number(paidAmount);

    const status =
      dueAmount === 0
        ? "Paid"
        : "Due";

    const { id } =
      await params;

    const updatedExpense =
      await Expense.findByIdAndUpdate(
        id,
        {
          ...body,
          dueAmount,
          status,
        },
        {
          new: true,
        }
      );

    return NextResponse.json(
      {
        success: true,
        message:
          "Expense updated successfully",

        updatedExpense,
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

    await Expense.findByIdAndDelete(
      id
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "Expense deleted successfully",
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