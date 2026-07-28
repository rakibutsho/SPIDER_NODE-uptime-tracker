import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
    }
}
