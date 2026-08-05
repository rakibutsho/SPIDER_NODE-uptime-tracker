import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { rateLimit, getIP } from "@/lib/rate-limit";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(req: Request) {
    try {
        const ip = getIP(req);
        // Max 5 registration attempts per IP per hour (3600000 ms)
        const { success, remaining } = rateLimit(`register_${ip}`, { limit: 5, windowMs: 3600000 });
        if (!success) {
            return NextResponse.json(
                { error: "Too many registration attempts. Please try again later." },
                { status: 429, headers: { "X-RateLimit-Remaining": remaining.toString() } }
            );
        }
        const body = await req.json();
        const { name, email, password } = body;

        // Validation Check
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters long' },
                { status: 400 }
            );
        }

        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "An account with this email already exists" },
                { status: 409 }
            );
        }
        // create new user and hash password
        const hashPassword = await bcrypt.hash(password, 10);
        // new user
        const newUser = await prisma.user.create({
            data: {
                name: name ? name.trim() : null,
                email: normalizedEmail,
                password: hashPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                createdAt: true
            }
        });

        // Generate verification token and send email
        const verificationToken = await generateVerificationToken(normalizedEmail);
        await sendVerificationEmail(verificationToken.email, verificationToken.token);

        return NextResponse.json(
            {
                message: "User registered. Please check your email to verify your account.",
                user: newUser
            },
            { status: 201 }
        )
    } catch (error) {
        console.log("Registration error:", error)
        return NextResponse.json(
            { error: "Something went wrong during registration" },
            { status: 500 }
        )

    }
}