import {
  Schema,
  model,
  models,
} from "mongoose";

const taskSchema = new Schema(
  {
    taskTitle: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    assignTo: {
      type: String,
      required: true,
    },

    importance: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High",
      ],
      default: "Low",
    },

    deadline: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Not Started",
        "In Progress",
        "Complete",
      ],
      default: "Not Started",
    },

    branchName: {
      type: String,
      required:true,
    },

    createdBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Task =
  models.Task ||
  model("Task", taskSchema);

export default Task;