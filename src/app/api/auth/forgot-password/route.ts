import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!existingUser) {
      // Return 200 even if user doesn't exist to prevent email enumeration attacks
      return NextResponse.json({ success: "Reset email sent!" }, { status: 200 });
    }

    const passwordResetToken = await generatePasswordResetToken(existingUser.email);
    await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

    return NextResponse.json({ success: "Reset email sent!" }, { status: 200 });

  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
