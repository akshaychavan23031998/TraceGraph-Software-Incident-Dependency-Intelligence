import { NextResponse } from "next/server";

import { verifyDatabaseConnectivity } from "@/lib/db/driver";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const isConnected = await verifyDatabaseConnectivity();

    if (isConnected) {
      return NextResponse.json({
        status: "ok",
        database: "connected",
      });
    }
  } catch (error) {
    console.error("CognoDB health check failed:", error);
  }

  return NextResponse.json(
    { status: "degraded", database: "unavailable" },
    { status: 503 },
  );
}

