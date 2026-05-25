import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Branch from "@/lib/models/Branch";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// UPDATE branch
export async function PUT(
  req: Request,
  { params }: RouteContext
) {
  try {
    await connectDB();

    const { id } = await params;

    const body = await req.json();

    const updatedBranch = await Branch.findByIdAndUpdate(
      { _id: id },
      { $set: body },
      { returnDocument: "after" }
    );

    if (!updatedBranch) {
      return NextResponse.json(
        { success: false, message: "Branch not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedBranch,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to update branch" },
      { status: 500 }
    );
  }
}

// DELETE branch
export async function DELETE(
  req: Request,
  { params }: RouteContext
) {
  try {
    await connectDB();

    const { id } = await params;

    const deleted = await Branch.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: true, message: "Branch already deleted" },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Branch deleted successfully",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to delete branch" },
      { status: 500 }
    );
  }
}