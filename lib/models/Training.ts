import {
  Schema,
  model,
  models,
} from "mongoose";

const trainingSchema =
  new Schema(
    {
      trainingTitle: {
        type: String,
        required: true,
      },

      trainingType: {
        type: String,
        required: true,
      },

      department: {
        type: String,
        required: true,
      },

      trainerName: {
        type: String,
        required: true,
      },

      trainerEmail: {
        type: String,
        required: true,
      },

      trainingUrl: {
        type: String,
        required: true,
      },

      assignEmails: [
        {
          type: String,
        },
      ],

      status: {
        type: String,
        enum: [
          "Pending",
          "Progress",
          "Complete",
        ],
        default: "Pending",
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

const Training =
  models.Training ||
  model(
    "Training",
    trainingSchema
  );

export default Training;