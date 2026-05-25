import mongoose, {
  Schema,
} from "mongoose";

const locationSchema =
  new Schema(
    {
      latitude: {
        type: Number,
        required: true,
      },

      longitude: {
        type: Number,
        required: true,
      },

      address: {
        type: String,
      },

      branchName: {
        type: String,
        required: true,
      },

      employeeName: {
        type: String,
      },

      employeeEmail: {
        type: String,
      },
    },
    {
      timestamps: true,
    }
  );

export default
  mongoose.models.Location ||
  mongoose.model(
    "Location",
    locationSchema
  );