import mongoose, {
  Schema,
} from "mongoose";

const settingSchema =
  new Schema(
    {
      businessName: {
        type: String,
      },

      businessEmail: {
        type: String,
      },

      address: {
        type: String,
      },

      phone: {
        type: String,
      },

      tagline: {
        type: String,
      },

      logo: {
        type: String,
      },

      branchName: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

export default
  mongoose.models.Setting ||
  mongoose.model(
    "Setting",
    settingSchema
  );