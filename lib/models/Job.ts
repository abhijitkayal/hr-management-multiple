import {
  Schema,
  model,
  models,
} from "mongoose";

const jobSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "Intern",
        "Full Time",
      ],
      required: true,
    },

    postedDate: {
      type: Date,
      default: Date.now,
    },

    closingDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Open",
        "Closed",
      ],
      default: "Open",
    },

    salary: {
      type: String,
      required: true,
    },

    experience: {
      type: String,
      required: true,
    },

    interviewType: {
      type: String,
      enum: [
        "Online",
        "Offline",
      ],
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    branchName: {
      type: String,
    },

    createdBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Job =
  models.Job ||
  model("Job", jobSchema);

export default Job;