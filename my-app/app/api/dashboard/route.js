import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    // In a real app, apply these filters to the Prisma queries
    const vehicleType = searchParams.get('vehicleType');
    const status = searchParams.get('status');
    const region = searchParams.get('region');

    const [
      activeVehicles,
      availableVehicles,
      vehiclesInShop,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      recentTrips,
      vehicleStatusCounts
    ] = await Promise.all([
      prisma.vehicle.count({ where: { status: { not: 'Retired' } } }),
      prisma.vehicle.count({ where: { status: 'Available' } }),
      prisma.vehicle.count({ where: { status: 'In Shop' } }),
      prisma.trip.count({ where: { status: { in: ['Dispatched', 'On Trip'] } } }),
      prisma.trip.count({ where: { status: 'Draft' } }),
      prisma.driver.count({ where: { status: 'On Trip' } }),
      prisma.trip.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          vehicleRel: { select: { name: true, registrationNumber: true } },
          driverRel: { select: { name: true } }
        }
      }),
      prisma.vehicle.groupBy({
        by: ['status'],
        _count: { status: true }
      })
    ]);

    const fleetUtilization = activeVehicles > 0 
      ? Math.round(((activeVehicles - availableVehicles - vehiclesInShop) / activeVehicles) * 100) 
      : 0;

    // Format vehicle status distribution for Recharts PieChart
    const statusDistribution = vehicleStatusCounts.map(v => ({
      name: v.status,
      value: v._count.status
    }));

    // Mock Monthly Expenses (in a real scenario, group Expense by month)
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
        activeTrips,
        pendingTrips,
        driversOnDuty,
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
