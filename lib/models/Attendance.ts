import mongoose, {
  Schema,
} from "mongoose";

const attendanceSchema =
  new Schema(
    {
      employeeName: String,

      employeeEmail: String,

      branchName: String,

      mode: String,

      officeAddress: String,

      currentLocation: String,

      status: String,

      latitude: Number,

      longitude: Number,
    },
    {
      timestamps: true,
    }
  );

export default
  mongoose.models.Attendance ||
  mongoose.model(
    "Attendance",
    attendanceSchema
  );