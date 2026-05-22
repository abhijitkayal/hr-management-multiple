import {
  Schema,
  model,
  models,
} from "mongoose";

const payrollSchema =
  new Schema(
    {
      payrollId: {
        type: String,
        required: true,
      },

      employeeName: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      paymentSalary: {
        type: Number,
        required: true,
      },

      paymentDate: {
        type: Date,
        required: true,
      },

      paymentStatus: {
        type: String,
        enum: [
          "Paid",
          "Pending",
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

const Payroll =
  models.Payroll ||
  model(
    "Payroll",
    payrollSchema
  );

export default Payroll;