import mongoose, { Schema } from "mongoose";

const notificationReadStatusSchema = new Schema(
  {
    notificationId: {
      type: String,
      required: true,
    },

    employeeId: {
      type: String,
      required: true,
    },

    branchName: {
      type: String,
      required: true,
    },

    readAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

notificationReadStatusSchema.index(
  {
    notificationId: 1,
    employeeId: 1,
    branchName: 1,
  },
  {
    unique: true,
  }
);

export default
  mongoose.models.NotificationReadStatus ||
  mongoose.model(
    "NotificationReadStatus",
    notificationReadStatusSchema
  );