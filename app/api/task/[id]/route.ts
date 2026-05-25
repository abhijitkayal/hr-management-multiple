// import {
//   NextRequest,
//   NextResponse,
// } from "next/server";

// import { connectDB } from "@/lib/mongodb";

// import Task from "@/lib/models/Task";

// // UPDATE TASK
// export async function PUT(
//   req: NextRequest,
//   {
//     params,
//   }: {
//     params: Promise<{
//       id: string;
//     }>;
//   }
// ) {
//   try {
//     await connectDB();

//     const body = await req.json();

//     const { id } =
//       await params;

//     const updatedTask =
//       await Task.findByIdAndUpdate(
//         id,
//         body,
//         {
//           new: true,
//         }
//       );

//     if (!updatedTask) {
//       return NextResponse.json(
//         {
//           success: false,
//           message:
//             "Task not found",
//         },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         message:
//           "Task updated successfully",

//         updatedTask,
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

// // DELETE TASK
// export async function DELETE(
//   req: NextRequest,
//   {
//     params,
//   }: {
//     params: Promise<{
//       id: string;
//     }>;
//   }
// ) {
//   try {
//     await connectDB();

//     const { id } =
//       await params;

//     const deletedTask =
//       await Task.findByIdAndDelete(
//         id
//       );

//     if (!deletedTask) {
//       return NextResponse.json(
//         {
//           success: false,
//           message:
//             "Task not found",
//         },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         message:
//           "Task deleted successfully",
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
import Task from "@/lib/models/Task";
import { connectDB } from "@/lib/mongodb";

type TaskSubTask = {
  completed?: boolean;
};

type TaskParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(
  req: Request,
  context: TaskParams
) {
  try {
    await connectDB();

    const body =
      await req.json();

    const { id } = await context.params;

    let progress = 0;

    if (
      body.subTasks?.length > 0
    ) {
      const completed =
        body.subTasks.filter(
          (s: TaskSubTask) =>
            s.completed
        ).length;

      progress = Math.round(
        (completed /
          body.subTasks.length) *
          100
      );
    }

    let status =
      "Not Started";

    if (
      progress > 0 &&
      progress < 100
    ) {
      status =
        "In Progress";
    }

    if (progress === 100) {
      status = "Complete";
    }

   const normalizedStatus =
  body.status === "Completed"
    ? "Complete"
    : body.status === "Not Started"
      ? "Pending"
      : body.status;

    const task =
      await Task.findById(id);

    if (!task) {
      return NextResponse.json({
        success: false,
        message:
          "Task not found",
      });
    }

    if (body.taskTitle !== undefined) {
      task.taskTitle = body.taskTitle;
    }

    if (body.description !== undefined) {
      task.description = body.description;
    }

    if (body.assignTo !== undefined) {
      task.assignTo = body.assignTo;
    }

    if (body.importance !== undefined) {
      task.importance = body.importance;
    }

    if (body.deadline !== undefined) {
      task.deadline = body.deadline;
    }

    if (Array.isArray(body.subTasks)) {
      task.subTasks = body.subTasks.map(
        (sub: TaskSubTask) => ({
          ...sub,

          completed: Boolean(sub.completed),
        })
      );
    }

    task.progress =
      progress;

    task.status =
      normalizedStatus || status;

    await task.save();
    // console.log("progress:", progress, "status:", status);

    return NextResponse.json({
      success: true,
      message:
        "Task updated",
      task,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
      message:
        "Update failed",
    });
  }
}

export async function DELETE(
  req: Request,
  { params }: TaskParams
) {
  try {
    await connectDB();

    const { id } = await params;

    await Task.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Task deleted",
    });
  } catch {
    return NextResponse.json({
      success: false,
    });
  }
}