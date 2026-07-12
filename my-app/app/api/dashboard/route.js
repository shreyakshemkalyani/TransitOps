import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vehicles, trips, drivers } from "@/db/schema";
import { count, eq, inArray, not, desc, sql } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicleType = searchParams.get('vehicleType');
    const status = searchParams.get('status');
    const region = searchParams.get('region');

    const [
      activeVehiclesResult,
      availableVehiclesResult,
      vehiclesInShopResult,
      activeTripsResult,
      pendingTripsResult,
      driversOnDutyResult,
      recentTrips,
      vehicleStatusCounts
    ] = await Promise.all([
      db.select({ value: count() }).from(vehicles).where(not(eq(vehicles.status, 'Retired'))),
      db.select({ value: count() }).from(vehicles).where(eq(vehicles.status, 'Available')),
      db.select({ value: count() }).from(vehicles).where(eq(vehicles.status, 'In Shop')),
      db.select({ value: count() }).from(trips).where(inArray(trips.status, ['Dispatched', 'On Trip'])),
      db.select({ value: count() }).from(trips).where(eq(trips.status, 'Draft')),
      db.select({ value: count() }).from(drivers).where(eq(drivers.status, 'On Trip')),
      db.query.trips.findMany({
        limit: 5,
        orderBy: [desc(trips.createdAt)],
        with: {
          vehicleRel: { columns: { name: true, registrationNumber: true } },
          driverRel: { columns: { name: true } }
        }
      }),
      db.select({ status: vehicles.status, count: count() }).from(vehicles).groupBy(vehicles.status)
    ]);

    const activeVehicles = activeVehiclesResult[0].value;
    const availableVehicles = availableVehiclesResult[0].value;
    const vehiclesInShop = vehiclesInShopResult[0].value;
    const activeTripsCount = activeTripsResult[0].value;
    const pendingTripsCount = pendingTripsResult[0].value;
    const driversOnDutyCount = driversOnDutyResult[0].value;

    const fleetUtilization = activeVehicles > 0 
      ? Math.round(((activeVehicles - availableVehicles - vehiclesInShop) / activeVehicles) * 100) 
      : 0;

    const statusDistribution = vehicleStatusCounts.map(v => ({
      name: v.status,
      value: v.count
    }));

    const monthlyExpenses = [
      { month: 'Jan', amount: 45000 },
      { month: 'Feb', amount: 52000 },
      { month: 'Mar', amount: 48000 },
      { month: 'Apr', amount: 61000 },
      { month: 'May', amount: 59000 },
      { month: 'Jun', amount: 65000 },
    ];

    return NextResponse.json({
      success: true,
      stats: {
        activeVehicles,
        availableVehicles,
        vehiclesInShop,
        activeTrips: activeTripsCount,
        pendingTrips: pendingTripsCount,
        driversOnDuty: driversOnDutyCount,
        fleetUtilization,
      },
      recentTrips,
      charts: {
        statusDistribution,
        monthlyExpenses
      }
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
