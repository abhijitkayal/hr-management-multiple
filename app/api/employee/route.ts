// import { NextRequest, NextResponse } from "next/server";

// import { connectDB } from "@/lib/mongodb";

// import Employee from "@/lib/models/Employees";

// // CREATE EMPLOYEE
// export async function POST(
//   req: NextRequest
// ) {
//   try {
//     await connectDB();

//     const body = await req.json();

//    const {
//   name,
//   email,
//   password,
//   phone,
//   emergencyPhone,
//   salary,
//   department,
//   hrEmail,
//   branchName,
// } = body;

//     // check existing employee
//     const existingEmployee =
//       await Employee.findOne({
//         email: email
//           .trim()
//           .toLowerCase(),
//       });

//     if (existingEmployee) {
//       return NextResponse.json(
//         {
//           success: false,
//           message:
//             "Employee already exists",
//         },
//         { status: 400 }
//       );
//     }

//     // create employee
//     const employee =
//       await Employee.create({
//         name,

//         email: email
//           .trim()
//           .toLowerCase(),

//         password,

//         phone,

//         emergencyPhone,

//         salary,

//         department,
//         branchName,

//         createdBy: hrEmail,
//       });

//     return NextResponse.json(
//       {
//         success: true,
//         message:
//           "Employee created successfully",

//         employee,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.log(error);

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Server Error",
//       },
//       { status: 500 }
//     );
//   }
// }

// // GET EMPLOYEES
// export async function GET() {
//   try {
//     await connectDB();

//     const employees =
//       await Employee.find().sort({
//         createdAt: -1,
//       });

//     return NextResponse.json(
//       {
//         success: true,
//         employees,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.log(error);

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Server Error",
//       },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import Employee from "@/lib/models/Employees";

// CREATE EMPLOYEE
export async function POST(
  req: NextRequest
) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      name,
      email,
      password,
      phone,
      emergencyPhone,
      salary,
      department,
      hrEmail,
      branchName,
      status, // ADD STATUS
    } = body;

    // check existing employee
    const existingEmployee =
      await Employee.findOne({
        email: email
          .trim()
          .toLowerCase(),
      });

    if (existingEmployee) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Employee already exists",
        },
        { status: 400 }
      );
    }

    // create employee
    const employee =
      await Employee.create({
        name,

        email: email
          .trim()
          .toLowerCase(),

        password,

        phone,

        emergencyPhone,

        salary,

        department,

        branchName,

        status, // SAVE STATUS

        createdBy: hrEmail,
      });
      console.log(employee);

    return NextResponse.json(
      {
        success: true,
        message:
          "Employee created successfully",

        employee,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("/api/employee error:", error);

    if ((error as any)?.name === "ValidationError") {
      return NextResponse.json(
        {
          success: false,
          message: (error as any).message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}

// GET EMPLOYEES
export async function GET() {
  try {
    await connectDB();

    const employees =
      await Employee.find().sort({
        createdAt: -1,
      });

    return NextResponse.json(
      {
        success: true,
        employees,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}