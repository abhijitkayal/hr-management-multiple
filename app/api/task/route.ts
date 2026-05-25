// import {
//   NextRequest,
//   NextResponse,
// } from "next/server";

// import nodemailer from "nodemailer";

// import { connectDB } from "@/lib/mongodb";

// import Task from "@/lib/models/Task";

// // CREATE TASK
// export async function POST(
//   req: NextRequest
// ) {
//   try {
//     await connectDB();

//     const body = await req.json();

//     const {
//       taskTitle,
//       description,
//       assignTo,
//       importance,
//       deadline,
//       status,
//       branchName,
//       createdBy,
//     } = body;

//     // CREATE TASK
//     const task =
//       await Task.create({
//         taskTitle,
//         description,
//         assignTo,
//         importance,
//         deadline,
//         status,
//         branchName,
//         createdBy,
//       });

//     // SEND MAIL
//     const transporter =
//       nodemailer.createTransport({
//         service: "gmail",

//         auth: {
//           user:
//             process.env.EMAIL_USER,

//           pass:
//             process.env.EMAIL_PASS,
//         },
//       });

//     await transporter.sendMail({
//       from:
//         process.env.EMAIL_USER,

//       to: assignTo,

//       subject:
//         "New Task Assigned",

//       html: `
//         <h2>New Task Assigned</h2>

//         <p><b>Task:</b> ${taskTitle}</p>

//         <p><b>Description:</b> ${description}</p>

//         <p><b>Importance:</b> ${importance}</p>

//         <p><b>Deadline:</b> ${deadline}</p>

//         <p><b>Status:</b> ${status}</p>
//       `,
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         message:
//           "Task created successfully",

//         task,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.log(error);

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Server Error",
//       },
//       { status: 500 }
//     );
//   }
// }

// // GET TASKS
// export async function GET() {
//   try {
//     await connectDB();

//     const tasks =
//       await Task.find().sort({
//         createdAt: -1,
//       });

//     return NextResponse.json(
//       {
//         success: true,
//         tasks,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.log(error);

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Server Error",
//       },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Task from "@/lib/models/Task";
import { connectDB } from "@/lib/mongodb";
import Notification from "@/lib/models/Notification";

type TaskSubTask = {
  completed?: boolean;
};

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    // CALCULATE PROGRESS
    let progress = 0;

    if (body.subTasks?.length > 0) {
      const completed =
        body.subTasks.filter(
          (s: TaskSubTask) => s.completed
        ).length;

      progress = Math.round(
        (completed / body.subTasks.length) * 100
      );
    }

    const task = await Task.create({
      ...body,
      progress,
    });

    if (body.assignTo) {
      const transporter =
        nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: body.assignTo,
        subject: "New Task Assigned",
       html: `
  <div style="font-family: Arial, sans-serif; padding: 20px;">

    <h2 style="color:#111827;">
      New Task Assigned
    </h2>

    <div style="margin-top:20px;">
      <p>
        <b>Task:</b>
        ${body.taskTitle}
      </p>

      <p>
        <b>Description:</b>
        ${body.description || "-"}
      </p>

      <p>
        <b>Importance:</b>
        ${body.importance || "Low"}
      </p>

      <p>
        <b>Deadline:</b>
        ${body.deadline || "-"}
      </p>

      <p>
        <b>Status:</b>
        ${body.status || "Not Started"}
      </p>

      <p>
        <b>Progress:</b>
        ${progress}%
      </p>
    </div>

    ${
      body.subTasks?.length > 0
        ? `
        <div style="margin-top:25px;">
          <h3 style="margin-bottom:10px;">
            Sub Tasks
          </h3>

          <ul style="padding-left:20px;">
            ${body.subTasks
              .map(
                (sub: any) => `
                  <li style="margin-bottom:8px;">
                    ${
                      sub.completed
                        ? "✅"
                        : "⭕"
                    }
                    ${sub.title}
                  </li>
                `
              )
              .join("")}
          </ul>
        </div>
      `
        : ""
    }

  </div>
`,
      });
    }
    await Notification.create({
  title: "New Task Assigned",

  message: `${body.taskTitle} assigned to ${body.assignTo}`,

  type: "task",

  branchName:
    body.branchName,
});

    return NextResponse.json({
      success: true,
      message: "Task created",
      task,
    });
  } catch {
    return NextResponse.json({
      success: false,
      message: "Failed",
    });
  }
}

export async function GET() {
  try {
    await connectDB();

    const tasks = await Task.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      tasks,
    });
  } catch {
    return NextResponse.json({
      success: false,
    });
  }
}