import dbConnect from "@/db/dbconnects";
import User from "@/schema/user";
import bcrypt from "bcryptjs";
import { serialize } from "cookie";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { emailOrUsername, password } = await request.json();

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    // If user doesn't exist
    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User not found. Please check your credentials.",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if user is verified
    if (!user.isVerified) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Account is not verified. Please verify your account.",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid credentials.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Set session cookie
    const cookie = serialize("sessionId", user._id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600, // 1 hour
      sameSite: "strict", // Correct value for sameSite
      path: "/",
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Login successful!",
        user: {
          username: user.username,
          email: user.email,
          fullname: user.Fullname,
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookie,
        },
      }
    );
  } catch (error) {
    console.error("Error during login:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error during login. Please try again later.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
