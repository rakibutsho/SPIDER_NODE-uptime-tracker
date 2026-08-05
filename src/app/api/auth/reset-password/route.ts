import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    });

    if (!existingToken) {
      return NextResponse.json({ error: "Invalid token!" }, { status: 400 });
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return NextResponse.json({ error: "Token has expired!" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: existingToken.email }
    });

    if (!existingUser) {
      return NextResponse.json({ error: "Email does not exist!" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: existingUser.id },
      data: { 
        password: hashedPassword,
        emailVerified: new Date()
      }
    });

    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id }
    });

    return NextResponse.json({ success: "Password updated successfully!" }, { status: 200 });

  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
