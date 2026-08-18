import { NextResponse } from "next/server";
import { runCleanup } from "@/lib/cleanup-logic";

export async function GET(req: Request) {
  try {
    // SECURITY CHECK (CRON SECRET VALIDATION)
    const authHeader = req.headers.get("authorization");
    const url = new URL(req.url);
    const querySecret = url.searchParams.get("secret");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      return NextResponse.json(
        { error: "CRON_SECRET is not configured in production environment." },
        { status: 500 },
      );
    }

    if (
      authHeader !== `Bearer ${cronSecret}` &&
      querySecret !== cronSecret
    ) {
      return NextResponse.json(
        { error: "Unauthorized Cron Request" },
        { status: 401 },
      );
    }

    // RUN CLEANUP
    const result = await runCleanup();

    return NextResponse.json(
      result,
      { status: 200 },
    );
  } catch (err: any) {
    console.error("Error running log cleanup:", err);
    return NextResponse.json(
      { message: "Internal Server Error", error: err.message, stack: err.stack },
      { status: 500 },
    );
  }
}
