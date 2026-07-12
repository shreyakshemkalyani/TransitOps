import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { vehicles } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const vehicle = await db.query.vehicles.findFirst({
      where: eq(vehicles.id, id)
    });

    if (!vehicle) {
      return NextResponse.json({ success: false, message: "Vehicle not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, vehicle });
  } catch (error) {
    console.error("GET /api/vehicles/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch vehicle" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Only update allowed fields
    const updateData = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.odometer !== undefined) updateData.odometer = parseFloat(body.odometer);
    if (body.registrationNumber !== undefined) updateData.registrationNumber = body.registrationNumber;
    
    const updated = await db.update(vehicles)
      .set(updateData)
      .where(eq(vehicles.id, id))
      .returning();

    return NextResponse.json({ success: true, vehicle: updated[0] });
  } catch (error) {
    console.error("PATCH /api/vehicles/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to update vehicle" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    // Check if vehicle can be deleted (maybe change status to Retired instead of hard delete)
    const deleted = await db.delete(vehicles)
      .where(eq(vehicles.id, id))
      .returning();
      
    return NextResponse.json({ success: true, vehicle: deleted[0] });
  } catch (error) {
    console.error("DELETE /api/vehicles/[id] error:", error);
    return NextResponse.json({ success: false, message: "Cannot delete vehicle, likely due to existing records (trips/maintenance)." }, { status: 400 });
  }
}
