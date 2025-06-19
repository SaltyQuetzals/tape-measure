import { computeResolutionRateOverTime } from "@/lib/stats/computeResolutionRateOverTime";
import { NextResponse } from "next/server";

/**
 * API route to get summary resolution rates.
 * Accepts optional `startDate` and `endDate` query parameters (ISO strings).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");

  const startDate = startDateParam ? new Date(startDateParam) : undefined;
  const endDate = endDateParam ? new Date(endDateParam) : undefined;

  const summary = await computeResolutionRateOverTime(startDate, endDate);

  return NextResponse.json(summary);
}
