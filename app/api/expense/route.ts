import {
  NextRequest,
  NextResponse,
} from "next/server";

import { connectDB } from "@/lib/mongodb";

import Expense from "@/lib/models/Expense";

// CREATE EXPENSE
export async function POST(
  req: NextRequest
) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      department,
      totalAmount,
      paidAmount,
      paymentDate,
      branchName,
      createdBy,
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

    // CALCULATE DUE
    const dueAmount =
      Number(totalAmount) -
      Number(paidAmount);

    // STATUS
    const status =
      dueAmount === 0
        ? "Paid"
        : "Due";

    // CREATE
    const expense =
      await Expense.create({
        department,
        totalAmount,
        paidAmount,
        dueAmount,
        paymentDate,
        status,
        branchName,
        createdBy,
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Expense added successfully",

        expense,
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

// GET EXPENSES
export async function GET() {
  try {
    await connectDB();

    const expenses =
      await Expense.find().sort({
        createdAt: -1,
      });

    return NextResponse.json(
      {
        success: true,
        expenses,
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