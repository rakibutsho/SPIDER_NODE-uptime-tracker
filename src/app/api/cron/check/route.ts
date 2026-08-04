import { NextResponse } from "next/server";
import { runCronChecks } from "@/lib/cron-logic";

export async function GET(req: Request) {
  try {
    // 1. SECURITY CHECK (CRON SECRET VALIDATION)
    const authHeader = req.headers.get("authorization");
    const url = new URL(req.url);
    const querySecret = url.searchParams.get("secret");
    const cronSecret = process.env.CRON_SECRET;

    if (
      cronSecret &&
      authHeader !== `Bearer ${cronSecret}` &&
      querySecret !== cronSecret
    ) {
      return NextResponse.json(
        { error: "Unauthorized Cron Request" },
        { status: 401 },
      );
    }

    // 2. RUN CHECKS
    const { message, result } = await runCronChecks();

    return NextResponse.json(
      { message, result },
      { status: 200 },
    );
  } catch (err: any) {
    console.log("Error fetching and checking URLs:", err);
    return NextResponse.json(
      { message: "Internal Server Error", error: err.message, stack: err.stack },
      { status: 500 },
    );
  }
}
