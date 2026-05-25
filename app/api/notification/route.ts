import { NextResponse } from "next/server";

import Notification from "@/lib/models/Notification";
import NotificationReadStatus from "@/lib/models/NotificationReadStatus";

import { connectDB } from "@/lib/mongodb";

export async function POST(
  req: Request
) {
  try {
    await connectDB();

    const body =
      await req.json();

    const notification =
      await Notification.create({
        title: body.title,
        message: body.message,
        type: body.type,
        branchName: body.branchName,
        read: false, // DEFAULT
        readByEmployeeIds: [],
      });

    return NextResponse.json({
      success: true,
      notification,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      success: false,
    });
  }
}

export async function GET(
  req: Request
) {

  try {

    await connectDB();

    const { searchParams } = new URL(
      req.url
    );

    const branchName =
      searchParams.get(
        "branchName"
      );

    const employeeId =
      searchParams.get(
        "employeeId"
      );

    if (!branchName) {
      return NextResponse.json({
        success: false,
        message:
          "branchName is required",
      });
    }

    const readNotificationIds =
      employeeId
        ? (
            await NotificationReadStatus.find(
              {
                branchName,
                employeeId,
              }
            ).select("notificationId")
          ).map((record) =>
            record.notificationId
          )
        : [];

    const notifications =
      await Notification.find({
        branchName,
        ...(readNotificationIds.length > 0
          ? {
              _id: {
                $nin: readNotificationIds,
              },
            }
          : {}),
      })
        .sort({
          createdAt: -1,
        });

    return NextResponse.json({
      success: true,
      notifications,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      success: false,
    });
  }
}

// MARK AS READ
export async function PATCH(
  req: Request
) {
  try {

    await connectDB();

    const body =
      await req.json();

    if (!body.id || !body.employeeId || !body.branchName) {
      return NextResponse.json({
        success: false,
        message:
          "id, employeeId, and branchName are required",
      });
    }

    await NotificationReadStatus.findOneAndUpdate(
      {
        notificationId: String(body.id),
        employeeId: String(body.employeeId),
        branchName: String(body.branchName),
      },
      {
        notificationId: String(body.id),
        employeeId: String(body.employeeId),
        branchName: String(body.branchName),
        readAt: new Date(),
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    await Notification.findByIdAndUpdate(
      body.id,
      {
        $addToSet: {
          readByEmployeeIds:
            body.employeeId,
        },
      }
    );

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      success: false,
    });
  }
}