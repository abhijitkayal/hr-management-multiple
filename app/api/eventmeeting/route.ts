import {
  NextRequest,
  NextResponse,
} from "next/server";

import nodemailer from "nodemailer";

import { connectDB } from "@/lib/mongodb";

import EventMeeting from "@/lib/models/EventMeeting";

// CREATE MEETING
export async function POST(
  req: NextRequest
) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      title,
      description,
      meetingLink,
      date,
      time,
      assign,
      branchName,
      createdBy,
    } = body;

    // STORE DATABASE
    const meeting =
      await EventMeeting.create({
        title,
        description,
        meetingLink,
        date,
        time,
        assign,
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

    // SEND MAIL TO MULTIPLE PERSON
    await transporter.sendMail({
      from:
        process.env.EMAIL_USER,

      to: assign,

      subject:
        "Meeting Invitation",

      html: `
        <h2>${title}</h2>

        <p><b>Description:</b> ${description}</p>

        <p><b>Date:</b> ${date}</p>

        <p><b>Time:</b> ${time}</p>

        <p>
          <a href="${meetingLink}">
            Join Meeting:${meetingLink}
          </a>
        </p>
      `,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Meeting created successfully",

        meeting,
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

// GET MEETINGS
export async function GET() {
  try {
    await connectDB();

    const meetings =
      await EventMeeting.find().sort({
        createdAt: -1,
      });

    return NextResponse.json(
      {
        success: true,
        meetings,
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