import {
  NextRequest,
  NextResponse,
} from "next/server";

import nodemailer from "nodemailer";

import { connectDB } from "@/lib/mongodb";

import Training from "@/lib/models/Training";

// CREATE TRAINING
export async function POST(
  req: NextRequest
) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      trainingTitle,
      trainingType,
      department,
      trainerName,
      trainerEmail,
      trainingUrl,
      assignEmails,
      status,
      branchName,
      createdBy,
    } = body;

    // STORE DATABASE
    const training =
      await Training.create({
        trainingTitle,
        trainingType,
        department,
        trainerName,
        trainerEmail,
        trainingUrl,
        assignEmails,
        status,
        branchName,
        createdBy,
      });

    // MAIL SETUP
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

    // SEND MAIL
    await transporter.sendMail({
      from:
        process.env.EMAIL_USER,

      to: assignEmails,

      subject:
        "Training Assigned",

      html: `
        <h2>${trainingTitle}</h2>

        <p><b>Training Type:</b> ${trainingType}</p>

        <p><b>Department:</b> ${department}</p>

        <p><b>Trainer:</b> ${trainerName}</p>

        <p><b>Status:</b> ${status}</p>

        <br/>

        <a href="${trainingUrl}">
          Join Training
        </a>
      `,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Training created successfully",

        training,
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

// GET TRAININGS
export async function GET() {
  try {
    await connectDB();

    const trainings =
      await Training.find().sort({
        createdAt: -1,
      });

    return NextResponse.json(
      {
        success: true,
        trainings,
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