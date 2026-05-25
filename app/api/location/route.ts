import {
  NextResponse,
} from "next/server";

import Location
from "@/lib/models/Location";

import { connectDB }
from "@/lib/mongodb";

// SAVE LOCATION
export async function POST(
  req: Request
) {
  try {

    await connectDB();

    const body =
      await req.json();

    const location =
      await Location.create({
        latitude:
          body.latitude,

        longitude:
          body.longitude,

        address:
          body.address,

        branchName:
          body.branchName,

        employeeName:
          body.employeeName,

        employeeEmail:
          body.employeeEmail,
      });

    return NextResponse.json({
      success: true,
      location,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      success: false,
    });
  }
}

// GET LOCATIONS
export async function GET() {

  try {

    await connectDB();

    const locations =
      await Location.find()
      .sort({
        createdAt: -1,
      });

    return NextResponse.json({
      success: true,
      locations,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      success: false,
    });
  }
}