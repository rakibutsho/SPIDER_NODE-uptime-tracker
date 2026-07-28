// ----------------------------------------------------
// 1. GET CURRENT USER PROFILE (GET)
// ----------------------------------------------------

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                telegramChatId: true,
                password: true,
                createdAt: true,
                updatedAt: true
            }
        });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        //password hash remove and flag add

        const { password, ...userData } = user;

        return NextResponse.json(
            {
                user: {
                    ...userData,
                    hasPassword: Boolean(password),
                },
            },
            { status: 200 },
        )
    } catch (error) {
        console.error('Get Profile Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user profile' },
            { status: 500 }
        )

    }
}

