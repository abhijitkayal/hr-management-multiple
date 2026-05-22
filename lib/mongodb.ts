// import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI || "";

// if (!MONGODB_URI) {
//   console.error("Missing MONGODB_URI environment variable. Ensure .env.local or environment provides it.");
//   throw new Error("MONGODB_URI missing");
// }

// let cached: any =
//   global.mongoose;

// if (!cached) {
//   cached =
//     global.mongoose = {
//       conn: null,
//       promise: null,
//     };
// }

// export async function connectDB() {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     cached.promise =
//       mongoose.connect(
//         MONGODB_URI
//       );
//   }

//   cached.conn =
//     await cached.promise;

//   return cached.conn;
// }


import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error(
    "Please define MONGODB_URI"
  );
}

// GLOBAL TYPE
declare global {

  var mongoose: {
    conn: any;
    promise: any;
  };
}

// CACHE
let cached =
  global.mongoose;

if (!cached) {

  cached =
    global.mongoose = {
      conn: null,
      promise: null,
    };
}

export async function connectDB() {

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {

    cached.promise =
      mongoose.connect(
        MONGODB_URI
      );
  }

  cached.conn =
    await cached.promise;

  return cached.conn;
}