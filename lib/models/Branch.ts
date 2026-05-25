// import mongoose from "mongoose";

// const branchSchema =
//   new mongoose.Schema(
//     {
//       branchName: {
//         type: String,
//         required: true,
//         unique: true,
//       },

//       address: {
//         type: String,
//       },

//       phone: {
//         type: String,
//       },

//       email: {
//         type: String,
//       },

//       password: {
//         type: String,
//       },

//       // managerName: {
//       //   type: String,
//       // },

//       hrName: {
//         type: String,
//       },

//       totalEmployees: {
//         type: Number,
//         default: 0,
//       },

//       active: {
//         type: Boolean,
//         default: true,
//       },
//     },
//     {
//       timestamps: true,
//     }
//   );

// export default mongoose.models
//   .Branch ||
//   mongoose.model(
//     "Branch",
//     branchSchema
//   );



import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
  {
    branchName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
    },

    hrName: {
      type: String,
      trim: true,
    },

    totalEmployees: {
      type: Number,
      default: 0,
    },

    // ✅ NEW FIELD ADDED
    totalBudget: {
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

export default mongoose.models.Branch ||
  mongoose.model("Branch", branchSchema);