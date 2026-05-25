import mongoose, {
  Schema,
} from "mongoose";

const notificationSchema =
  new Schema(
    {
      title: {
        type: String,
        required: true,
      },

      message: {
        type: String,
        required: true,
      },

      type: {
        type: String,
        default: "general",
      },

      read: {
        type: Boolean,
        default: false,
      },

      readByEmployeeIds: {
        type: [String],
        default: [],
      },

      branchName: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

export default
  mongoose.models.Notification ||
  mongoose.model(
    "Notification",
    notificationSchema
  );