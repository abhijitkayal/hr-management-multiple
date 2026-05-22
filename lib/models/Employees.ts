import mongoose, { Schema, models, model } from "mongoose";

const employeeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    emergencyPhone: {
      type: String,
      required: true,
    },

    salary: {
      type: Number,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },
    status: {
  type: String,
  enum: [
    "Full Time",
    "Intern",
    "Leave",
  ],
  default: "Full Time",
},

    branchName: {
      type: String,
    //   required: true,
    },

    createdBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Employee =
  models.Employee ||
  model("Employee", employeeSchema);

export default Employee;