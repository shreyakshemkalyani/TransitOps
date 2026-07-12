import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { maintenance, vehicles } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const allRecords = await db.query.maintenance.findMany({
      with: { vehicle: true },
      orderBy: [desc(maintenance.createdAt)],
    });

    return NextResponse.json({ success: true, records: allRecords });
  } catch (error) {
    console.error("GET /api/maintenance error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch maintenance records" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const { vehicleId, description, cost, startDate } = body;

    // Verify vehicle
    const vehicle = await db.query.vehicles.findFirst({ where: eq(vehicles.id, vehicleId) });
    if (!vehicle) return NextResponse.json({ success: false, message: "Vehicle not found" }, { status: 404 });
    if (vehicle.status === 'On Trip') {
      return NextResponse.json({ success: false, message: "Cannot service a vehicle currently On Trip." }, { status: 400 });
    }

    // Create Maintenance Record
    const newRecord = await db.insert(maintenance).values({
      vehicleId,
      description,
      cost: Number(cost || 0),
      startDate: new Date(startDate || new Date()),
      status: "Active",
    }).returning();

    // Auto-update vehicle status to In Shop
    await db.update(vehicles).set({ status: 'In Shop' }).where(eq(vehicles.id, vehicleId));

    return NextResponse.json({ success: true, record: newRecord[0] }, { status: 201 });
  } catch (error) {
    console.error("POST /api/maintenance error:", error);
    return NextResponse.json({ success: false, message: "Failed to create maintenance record." }, { status: 500 });
  }
}
