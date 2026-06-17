// import { NextResponse } from "next/server";

// import User from "@/lib/models/User";

// import { connectDB } from "@/lib/mongodb";

// export async function POST(
//   request: Request
// ) {
//   try {
//     await connectDB();

//     const body =
//       await request.json();

//     const {
//       name,
//       email,
//       password,
//       role,
//     } = body;

//     if (
//       !name ||
//       !email ||
//       !password
//     ) {
//       return NextResponse.json({
//         success: false,
//         message:
//           "Fill all fields",
//       });
//     }

//     const existing =
//       await User.findOne({
//         email:
//           email.trim(),
//       });

//     if (existing) {
//       return NextResponse.json({
//         success: false,
//         message:
//           "User already exists",
//       });
//     }

//     const avatar =
//       name
//         .split(" ")
//         .map(
//           (word: string) =>
//             word[0]
//         )
//         .join("")
//         .toUpperCase();

//     const user =
//       await User.create({
//         name:
//           name.trim(),

//         email:
//           email.trim(),

//         password:
//           password.trim(),

//         role,

//         avatar,
//       });

//     return NextResponse.json({
//       success: true,
//       data: user,
//     });
//   } catch (error) {
//     console.log(error);

//     return NextResponse.json({
//       success: false,
//     });
//   }
// }


import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import User from "@/lib/models/User";
import { connectDB } from "@/lib/mongodb";

export async function POST(
  request: Request
) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      name,
      email,
      password,
      role,
    } = body;

    if (
      !name ||
      !email ||
      !password
    ) {
      return NextResponse.json({
        success: false,
        message:
          "Fill all fields",
      });
    }

    const existing =
      await User.findOne({
        email: email.trim(),
      });

    if (existing) {
      return NextResponse.json({
        success: false,
        message:
          "User already exists",
      });
    }

    const avatar = name
      .split(" ")
      .map(
        (word: string) => word[0]
      )
      .join("")
      .toUpperCase();

    // Hash password
    const hashedPassword =
      await bcrypt.hash(
        password.trim(),
        12
      );

    const user =
      await User.create({
        name: name.trim(),

        email: email.trim(),

        password:
          hashedPassword,

        role,

        avatar,
      });

    return NextResponse.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}