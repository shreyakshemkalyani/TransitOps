import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    vehicles: 0,
    drivers: 0,
    activeTrips: 0,
    monthlyExpenses: 0,
  });
}
