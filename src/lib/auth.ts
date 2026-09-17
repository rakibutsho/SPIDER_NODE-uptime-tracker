import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as any,
    session: {
        strategy: "jwt",
    },
    providers: [
        // google login
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            allowDangerousEmailAccountLinking: true,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
            allowDangerousEmailAccountLinking: true,
        }),

        // credentials login
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    throw new Error("Email and password required");
                }
                const normalizedEmail = credentials.email.toLowerCase().trim();

                // Check if User Exists
                const user = await prisma.user.findUnique({
                    where: { email: normalizedEmail },
                });

                if (!user || !user.password) {
                    throw new Error("No user found with this email");
                }

                if (!user.emailVerified) {
                    throw new Error("Please verify your email address before logging in.");
                }

                // compare password hash
                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) {
                    throw new Error("Invalid Password");
                }

                // if login success
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                };
            },
        }),
    ],
    pages: {
        signIn: "/login",
        error: "/login",
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google" || account?.provider === "github") {
                if (user.email) {
                    try {
                        const existingUser = await prisma.user.findUnique({
                            where: { email: user.email.toLowerCase() },
                        });
                        if (existingUser && !existingUser.emailVerified) {
                            await prisma.user.update({
                                where: { id: existingUser.id },
                                data: { emailVerified: new Date() },
                            });
                        }
                    } catch (e) {
                        console.error("Error auto-verifying OAuth user email:", e);
                    }
                }
            }
            return true;
        },
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
            }
            
            // Ensure token.id is always populated for OAuth users
            if (!token.id && token.email) {
                try {
                    const dbUser = await prisma.user.findUnique({
                        where: { email: token.email.toLowerCase() },
                        select: { id: true },
                    });
                    if (dbUser) {
                        token.id = dbUser.id;
                    }
                } catch (e) {
                    console.error("Error fetching dbUser in jwt callback:", e);
                }
            }
            
            // Handle session update
            if (trigger === "update" && session) {
                if (session.image !== undefined) {
                    token.picture = session.image; // NextAuth uses 'picture' internally for image
                }
                if (session.name !== undefined) {
                    token.name = session.name;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                if (token.picture) session.user.image = token.picture;
                if (token.name) session.user.name = token.name;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
