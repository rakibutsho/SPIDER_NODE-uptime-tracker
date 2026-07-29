

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from 'cloudinary';
import bcrypt from "bcryptjs";

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

// ----------------------------------------------------
// 1. GET CURRENT USER PROFILE (GET)
// ----------------------------------------------------
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

// ----------------------------------------------------
// 2. UPDATE USER PROFILE & PASSWORD (PATCH)
// ----------------------------------------------------

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        //get user data
        const body = await req.json();
        const { name, telegramChatId, currentPassword, newPassword, image } = body;

        const existingUser = await prisma.user.findUnique({
            where: { id: session.user.id },
        })

        if (!existingUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });

        }

        const updateData: Record<string, any> = {};
        if (name !== undefined) updateData.name = name.trim();
        if (telegramChatId !== undefined) updateData.telegramChatId = telegramChatId.trim();

        // ------------------------------------------------
        // CLOUDINARY IMAGE HANDLER
        // ------------------------------------------------
        if (image) {
            //new image /file Base64/DataUrl Format
            if (image.startsWith('data:image/')) {
                const uploadedResponse = await cloudinary.uploader.upload(image, {
                    folder: "uptime_tracker/user_profiles",
                    resource_type: "image"
                });
                updateData.image = uploadedResponse.secure_url;

            } else {
                updateData.image = image;
            }
        }

        // ------------------------------------------------
        // PASSWORD UPDATE LOGIC
        // ------------------------------------------------

        if (newPassword) {
            if (newPassword.length < 6) {
                return NextResponse.json(
                    { error: "New password must be at least 6 characters long" },
                    { status: 400 }
                )
            }

            // If the user already has a password, we must verify their current password
            if (existingUser.password) {
                if (!currentPassword) {
                    return NextResponse.json(
                        { error: "Current password is required to set a new password" },
                        { status: 400 }
                    )
                }

                const isCurrentPasswordValid = await bcrypt.compare(
                    currentPassword,
                    existingUser.password
                )

                if (!isCurrentPasswordValid) {
                    return NextResponse.json(
                        { error: "Invalid current password" },
                        { status: 400 }
                    )
                }
            }

            // Hash the new password and add to updateData
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            updateData.password = hashedPassword;
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { error: "No fields provided for update" },
                { status: 400 }
            )
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                telegramChatId: true,
                updatedAt: true
            }
        });

        return NextResponse.json(
            {
                message: "Profile updated successfully",
                user: updatedUser
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("Update Profile Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// ----------------------------------------------------
// 3. DELETE USER ACCOUNT (DELETE)
// ----------------------------------------------------
export async function DELETE() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        await prisma.user.delete({
            where: { id: session.user.id },
        })

        return NextResponse.json(
            { message: "User account and all associated data deleted successfully" },
            { status: 200 }
        )
    } catch (error) {
        console.error('Delete Profile Error:', error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }

}