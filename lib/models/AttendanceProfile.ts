import mongoose, {
  Schema,
} from "mongoose";

const attendanceProfileSchema =
  new Schema(
    {
      employeeName: String,

      employeeEmail: String,

      branchName: String,

      mode: String,

      officeAddress: String,
    },
    {
      timestamps: true,
    }
  );

export default
  mongoose.models
    .AttendanceProfile ||
  mongoose.model(
    "AttendanceProfile",
    attendanceProfileSchema
  );