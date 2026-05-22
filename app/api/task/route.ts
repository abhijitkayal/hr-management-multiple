import {
  NextRequest,
  NextResponse,
} from "next/server";

import nodemailer from "nodemailer";

import { connectDB } from "@/lib/mongodb";

import Task from "@/lib/models/Task";

// CREATE TASK
export async function POST(
  req: NextRequest
) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      taskTitle,
      description,
      assignTo,
      importance,
      deadline,
      status,
      branchName,
      createdBy,
    } = body;

    // CREATE TASK
    const task =
      await Task.create({
        taskTitle,
        description,
        assignTo,
        importance,
        deadline,
        status,
        branchName,
        createdBy,
      });

    // SEND MAIL
    const transporter =
      nodemailer.createTransport({
        service: "gmail",

        auth: {
          user:
            process.env.EMAIL_USER,

          pass:
            process.env.EMAIL_PASS,
        },
      });

    await transporter.sendMail({
      from:
        process.env.EMAIL_USER,

      to: assignTo,

      subject:
        "New Task Assigned",

      html: `
        <h2>New Task Assigned</h2>

        <p><b>Task:</b> ${taskTitle}</p>

        <p><b>Description:</b> ${description}</p>

        <p><b>Importance:</b> ${importance}</p>

        <p><b>Deadline:</b> ${deadline}</p>

        <p><b>Status:</b> ${status}</p>
      `,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Task created successfully",

        task,
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

// GET TASKS
export async function GET() {
  try {
    await connectDB();

    const tasks =
      await Task.find().sort({
        createdAt: -1,
      });

    return NextResponse.json(
      {
        success: true,
        tasks,
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