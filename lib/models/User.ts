import mongoose from "mongoose";

const userSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
      },

      // Reference to Branch document
      branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
        default: null,
      },

      branchName: {
        type: String,
        default: "",
      },

      password: {
        type: String,
        required: true,
      },

      role: {
  type: String,

  enum: [
    "hr",
    "admin",
  ],

  default: "hr",
},

      avatar: {
        type: String,
        default: "",
      },
      resetToken: {
  type: String,
},

resetTokenExpiry: {
  type: Date,
},
    },
    {
      timestamps: true,
    }
  );

export default mongoose.models
  .User ||
  mongoose.model(
    "User",
    userSchema
  );