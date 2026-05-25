import mongoose from "mongoose";

const branchSchema =
  new mongoose.Schema(
    {
      branchName: {
        type: String,
        required: true,
        unique: true,
      },

      address: {
        type: String,
      },

      phone: {
        type: String,
      },

      email: {
        type: String,
      },

      password: {
        type: String,
      },

      // managerName: {
      //   type: String,
      // },

      hrName: {
        type: String,
      },

      totalEmployees: {
        type: Number,
        default: 0,
      },

      active: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.models
  .Branch ||
  mongoose.model(
    "Branch",
    branchSchema
  );