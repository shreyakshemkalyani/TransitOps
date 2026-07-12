import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vehicles } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const allVehicles = await db.query.vehicles.findMany({
      orderBy: [desc(vehicles.createdAt)],
    });

    return NextResponse.json({
      success: true,
      vehicles: allVehicles,
    });
  } catch (error) {
    console.error("GET /api/vehicles error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch vehicles" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Check for unique registration number
    const existing = await db.query.vehicles.findFirst({
      where: eq(vehicles.registrationNumber, body.registrationNumber)
    });
    
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Vehicle with this registration number already exists." },
        { status: 400 }
      );
    }

    const newVehicle = await db.insert(vehicles).values({
      registrationNumber: body.registrationNumber,
      name: body.name,
      type: body.type,
      capacity: parseFloat(body.capacity),
      odometer: parseFloat(body.odometer) || 0,
      acquisitionCost: parseFloat(body.acquisitionCost) || 0,
      status: body.status || 'Available',
    }).returning();

    return NextResponse.json({
      success: true,
      vehicle: newVehicle[0],
    });
  } catch (error) {
    console.error("POST /api/vehicles error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create vehicle" },
      { status: 500 }
    );
  }
}
