import {
  Schema,
  model,
  models,
} from "mongoose";

const interviewSchema =
  new Schema(
    {
      position: {
        type: String,
        required: true,
      },

      interviewType: {
        type: String,
        enum: [
          "First Round",
          "Technical",
          "HR Round",
        ],
        required: true,
      },

      interviewerName: {
        type: String,
        required: true,
      },

      date: {
        type: Date,
        required: true,
      },

      time: {
        type: String,
        required: true,
      },

      duration: {
        type: String,
        required: true,
      },

      url: {
        type: String,
      },

      description: {
        type: String,
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

const Interview =
  models.Interview ||
  model(
    "Interview",
    interviewSchema
  );

export default Interview;