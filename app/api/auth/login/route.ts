// // import { NextResponse } from "next/server";

// // import jwt from "jsonwebtoken";

// // import User from "@/lib/models/User";

// // import Employee from "@/lib/models/Employees";

// // import { connectDB } from "@/lib/mongodb";

// // export async function POST(
// //   request: Request
// // ) {
// //   try {
// //     await connectDB();

// //     const body =
// //       await request.json();

// //     const {
// //       email,
// //       password,
// //     } = body;

// //     // ======================
// //     // CHECK USER COLLECTION
// //     // ======================

// //     const user =
// //       await User.findOne({
// //         email:
// //           email.trim(),
// //       });

// //     if (user) {
// //       // PASSWORD CHECK
// //       if (
// //         user.password !==
// //         password.trim()
// //       ) {
// //         return NextResponse.json({
// //           success: false,
// //           message:
// //             "Wrong password",
// //         });
// //       }

// //       const token =
// //         jwt.sign(
// //           {
// //             id: user._id,
// //           },

// //           process.env
// //             .JWT_SECRET!,

// //           {
// //             expiresIn: "7d",
// //           }
// //         );

// //       return NextResponse.json({
// //         success: true,

// //         token,

// //         user: {
// //           id: user._id,

// //           name: user.name,

// //           email:
// //             user.email,

// //           role: user.role,

// //           avatar:
// //             user.avatar,

// //           branch:
// //             user.branch ||
// //             null,

// //           branchName:
// //             user.branchName ||
// //             "",
// //         },
// //       });
// //     }

// //     // =========================
// //     // CHECK EMPLOYEE COLLECTION
// //     // =========================

// //     const employee =
// //       await Employee.findOne({
// //         email:
// //           email.trim(),
// //       });

// //     if (!employee) {
// //       return NextResponse.json({
// //         success: false,
// //         message:
// //           "User not found",
// //       });
// //     }

// //     // PASSWORD CHECK
// //     if (
// //       employee.password !==
// //       password.trim()
// //     ) {
// //       return NextResponse.json({
// //         success: false,
// //         message:
// //           "Wrong password",
// //       });
// //     }

// //     const token = jwt.sign(
// //       {
// //         id: employee._id,
// //       },

// //       process.env
// //         .JWT_SECRET!,

// //       {
// //         expiresIn: "7d",
// //       }
// //     );

// //     return NextResponse.json({
// //       success: true,

// //       token,

// //       user: {
// //         id: employee._id,

// //         name: employee.name,

// //         email:
// //           employee.email,

// //         role: "employee",

// //         branchName:
// //           employee.branchName ||
// //           "",
// //       },
// //     });
// //   } catch (error) {
// //     console.log(error);

// //     return NextResponse.json({
// //       success: false,
// //       message:
// //         "Server error",
// //     });
// //   }
// // }




// import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";

// import User from "@/lib/models/User";
// import Employee from "@/lib/models/Employees";

// import { connectDB } from "@/lib/mongodb";

// export async function POST(
//   request: NextRequest
// ) {
//   try {
//     await connectDB();

//     const body = await request.json();

//     const { email, password } = body;

//     if (!email || !password) {
//       return NextResponse.json(
//         {
//           success: false,
//           message:
//             "Email and password are required",
//         },
//         {
//           status: 400,
//         }
//       );
//     }

//     // ======================
//     // CHECK USER COLLECTION
//     // ======================

//     const user = await User.findOne({
//       email: email.trim(),
//     });

//     if (user) {
//       const isPasswordValid =
//         await bcrypt.compare(
//           password.trim(),
//           user.password
//         );

//       if (!isPasswordValid) {
//         return NextResponse.json(
//           {
//             success: false,
//             message: "Wrong password",
//           },
//           {
//             status: 401,
//           }
//         );
//       }

//       const token = jwt.sign(
//         {
//           id: user._id,
//           role: user.role,
//         },
//         process.env.JWT_SECRET!,
//         {
//           expiresIn: "7d",
//         }
//       );

//       return NextResponse.json({
//         success: true,

//         token,

//         user: {
//           id: user._id,

//           name: user.name,

//           email: user.email,

//           role: user.role,

//           avatar: user.avatar,

//           branch:
//             user.branch || null,

//           branchName:
//             user.branchName || "",
//         },
//       });
//     }

//     // =========================
//     // CHECK EMPLOYEE COLLECTION
//     // =========================

//     const employee =
//       await Employee.findOne({
//         email: email.trim(),
//       });

//     if (!employee) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "User not found",
//         },
//         {
//           status: 404,
//         }
//       );
//     }

//     const isPasswordValid =
//       await bcrypt.compare(
//         password.trim(),
//         employee.password
//       );

//     if (!isPasswordValid) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Wrong password",
//         },
//         {
//           status: 401,
//         }
//       );
//     }

//     const token = jwt.sign(
//       {
//         id: employee._id,
//         role: "employee",
//       },
//       process.env.JWT_SECRET!,
//       {
//         expiresIn: "7d",
//       }
//     );

//     return NextResponse.json({
//       success: true,

//       token,

//       user: {
//         id: employee._id,

//         name: employee.name,

//         email: employee.email,

//         role: "employee",

//         branchName:
//           employee.branchName || "",
//       },
//     });
//   } catch (error) {
//     console.error(
//       "Login Error:",
//       error
//     );

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Server error",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }





import { NextResponse } from "next/server";

import jwt from "jsonwebtoken";

import User from "@/lib/models/User";

import Employee from "@/lib/models/Employees";

import { connectDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(
  request: Request
) {
  try {
    await connectDB();

    const body =
      await request.json();

    const {
      email,
      password,
    } = body;

    // ======================
    // CHECK USER COLLECTION
    // ======================

    const user =
      await User.findOne({
        email:
          email.trim(),
      });

    if (user) {
      // PASSWORD CHECK
     const isUserPasswordValid =
  await bcrypt.compare(
    password.trim(),
    user.password
  );

if (!isUserPasswordValid) {
  return NextResponse.json({
    success: false,
    message: "Wrong password",
  });
}

      const token =
        jwt.sign(
          {
            id: user._id,
          },

          process.env
            .JWT_SECRET!,

          {
            expiresIn: "7d",
          }
        );

      return NextResponse.json({
        success: true,

        token,

        user: {
          id: user._id,

          name: user.name,

          email:
            user.email,

          role: user.role,

          avatar:
            user.avatar,

          branch:
            user.branch ||
            null,

          branchName:
            user.branchName ||
            "",
        },
      });
    }

    // =========================
    // CHECK EMPLOYEE COLLECTION
    // =========================

    const employee =
      await Employee.findOne({
        email:
          email.trim(),
      });

    if (!employee) {
      return NextResponse.json({
        success: false,
        message:
          "User not found",
      });
    }

    // PASSWORD CHECK
    if (
      employee.password !==
      password.trim()
    ) {
      return NextResponse.json({
        success: false,
        message:
          "Wrong password",
      });
    }

    const token = jwt.sign(
      {
        id: employee._id,
      },

      process.env
        .JWT_SECRET!,

      {
        expiresIn: "7d",
      }
    );

    return NextResponse.json({
      success: true,

      token,

      user: {
        id: employee._id,

        name: employee.name,

        email:
          employee.email,

        role: "employee",

        branchName:
          employee.branchName ||
          "",
      },
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
      message:
        "Server error",
    });
  }
}