import {
  Schema,
  model,
  models,
} from "mongoose";

const expenseSchema =
  new Schema(
    {
      department: {
        type: String,
        required: true,
      },

      totalAmount: {
        type: Number,
        required: true,
      },

      paidAmount: {
        type: Number,
        required: true,
      },

      dueAmount: {
        type: Number,
        default: 0,
      },

      paymentDate: {
        type: Date,
        required: true,
      },

      status: {
        type: String,
        enum: [
          "Paid",
          "Due",
        ],
        default: "Due",
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

const Expense =
  models.Expense ||
  model(
    "Expense",
    expenseSchema
  );

export default Expense;