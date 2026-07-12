import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trips, vehicles, drivers } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const allTrips = await db.query.trips.findMany({
      with: {
        vehicleRel: true,
        driverRel: true
      },
      orderBy: [desc(trips.createdAt)],
    });

    return NextResponse.json({ success: true, trips: allTrips });
  } catch (error) {
    console.error("GET /api/trips error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch trips." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      tripNumber, source, destination, plannedDistance, eta,
      vehicleId, driverId, cargoWeight
    } = body;

    // Validation: Vehicle Capacity and Status
    const vehicle = await db.query.vehicles.findFirst({ where: eq(vehicles.id, vehicleId) });
    if (!vehicle) return NextResponse.json({ success: false, message: "Vehicle not found" }, { status: 404 });
    if (vehicle.status === 'Retired' || vehicle.status === 'In Shop') {
      return NextResponse.json({ success: false, message: "Vehicle is Retired or In Shop and cannot be dispatched." }, { status: 400 });
    }
    if (cargoWeight > vehicle.capacity) {
      return NextResponse.json({ success: false, message: `Cargo Weight (${cargoWeight}kg) exceeds vehicle capacity (${vehicle.capacity}kg).` }, { status: 400 });
    }

    // Validation: Driver Status and License
    const driver = await db.query.drivers.findFirst({ where: eq(drivers.id, driverId) });
    if (!driver) return NextResponse.json({ success: false, message: "Driver not found" }, { status: 404 });
    if (driver.status === 'Suspended') {
      return NextResponse.json({ success: false, message: "Driver is suspended." }, { status: 400 });
    }
    if (new Date(driver.expiryDate) < new Date()) {
      return NextResponse.json({ success: false, message: "Driver license is expired." }, { status: 400 });
    }
    if (driver.status === 'On Trip' || vehicle.status === 'On Trip') {
       return NextResponse.json({ success: false, message: "Driver or Vehicle is already On Trip." }, { status: 400 });
    }

    // Create Draft Trip
    const newTrip = await db.insert(trips).values({
      tripNumber: tripNumber || `TRP-${Math.floor(Math.random() * 10000)}`,
      source,
      destination,
      plannedDistance: Number(plannedDistance || 0),
      eta,
      vehicleId,
      driverId,
      cargoWeight: Number(cargoWeight || 0),
      status: "Draft",
    }).returning();

    return NextResponse.json({ success: true, trip: newTrip[0] }, { status: 201 });
  } catch (error) {
    console.error("POST /api/trips error:", error);
    return NextResponse.json({ success: false, message: "Failed to create trip." }, { status: 500 });
  }
}