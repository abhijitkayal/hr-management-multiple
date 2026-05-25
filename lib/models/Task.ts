// import {
//   Schema,
//   model,
//   models,
// } from "mongoose";

// const taskSchema = new Schema(
//   {
//     taskTitle: {
//       type: String,
//       required: true,
//     },

//     description: {
//       type: String,
//       required: true,
//     },

//     assignTo: {
//       type: String,
//       required: true,
//     },

//     importance: {
//       type: String,
//       enum: [
//         "Low",
//         "Medium",
//         "High",
//       ],
//       default: "Low",
//     },

//     deadline: {
//       type: Date,
//       required: true,
//     },

//     status: {
//       type: String,
//       enum: [
//         "Not Started",
//         "In Progress",
//         "Complete",
//       ],
//       default: "Not Started",
//     },

//     branchName: {
//       type: String,
//       required:true,
//     },

//     createdBy: {
//       type: String,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Task =
//   models.Task ||
//   model("Task", taskSchema);

// export default Task;



import mongoose, { Schema } from "mongoose";

const subTaskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const taskSchema = new Schema(
  {
    taskTitle: {
      type: String,
      required: true,
    },

    description: String,

    assignTo: String,

    importance: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },

    deadline: Date,

    status: {
      type: String,
      enum: [
        "Not Started",
        "Pending",
        "In Progress",
        "Complete",
      ],
      default: "Not Started",
    },

    // NEW
    subTasks: [subTaskSchema],

    // AUTO PROGRESS
    progress: {
      type: Number,
      default: 0,
    },

    // STORE BRANCH NAME
    branchName: {
      type: String,
      required: true,
    },

    createdBy: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Task ||
  mongoose.model("Task", taskSchema);