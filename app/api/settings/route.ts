import {
  NextResponse,
} from "next/server";

import mongoose, {
  Schema,
} from "mongoose";

import {
  v2 as cloudinary,
} from "cloudinary";

import { connectDB }
from "@/lib/mongodb";

// CLOUDINARY CONFIG
cloudinary.config({
  cloud_name:
    process.env
      .CLOUDINARY_CLOUD_NAME,

  api_key:
    process.env
      .CLOUDINARY_API_KEY,

  api_secret:
    process.env
      .CLOUDINARY_API_SECRET,
});

// SCHEMA
const settingSchema =
  new Schema(
    {
      businessName: String,

      businessEmail: String,

      address: String,

      phone: String,

      tagline: String,

      logo: String,

      branchName: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

const Setting =
  mongoose.models.Setting ||
  mongoose.model(
    "Setting",
    settingSchema
  );

// SAVE SETTINGS
export async function POST(
  req: Request
) {
  try {

    await connectDB();

    const body =
      await req.json();

    let logoUrl =
      body.logo;

    // UPLOAD TO CLOUDINARY
    if (
      body.logo &&
      body.logo.startsWith(
        "data:image"
      )
    ) {

      const uploaded =
        await cloudinary.uploader.upload(
          body.logo,
          {
            folder:
              "business-settings",
          }
        );

      logoUrl =
        uploaded.secure_url;
    }

    // CHECK EXISTING
    const existing =
      await Setting.findOne({
        branchName:
          body.branchName,
      });

    // UPDATE
    if (existing) {

      const updated =
        await Setting.findByIdAndUpdate(
          existing._id,
          {
            businessName:
              body.businessName,

            businessEmail:
              body.businessEmail,

            address:
              body.address,

            phone:
              body.phone,

            tagline:
              body.tagline,

            logo:
              logoUrl,
          },
          {
            new: true,
          }
        );

      return NextResponse.json({
        success: true,
        setting: updated,
      });
    }

    // CREATE
    const setting =
      await Setting.create({
        businessName:
          body.businessName,

        businessEmail:
          body.businessEmail,

        address:
          body.address,

        phone:
          body.phone,

        tagline:
          body.tagline,

        logo:
          logoUrl,

        branchName:
          body.branchName,
      });

    return NextResponse.json({
      success: true,
      setting,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      success: false,
    });
  }
}

// GET SETTINGS
export async function GET(
  req: Request
) {
  try {

    await connectDB();

    const {
      searchParams,
    } = new URL(req.url);

    const branchName =
      searchParams.get(
        "branchName"
      );

    const setting =
      await Setting.findOne({
        branchName,
      });

    return NextResponse.json({
      success: true,
      setting,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      success: false,
    });
  }
}