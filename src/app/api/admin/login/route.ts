import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import Admin from "@/lib/models/Admin";
import { connectDB } from "@/lib/db";

export async function POST(req: Request) {
  await connectDB();

  const { email, password } = await req.json();

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return Response.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, admin.password);
  if (!isValid) {
    return Response.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const token = jwt.sign(
    { adminId: admin._id, role: "admin" },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  const cookieStore = await cookies();

  cookieStore.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return Response.json({ message: "Admin login successful" });
}
