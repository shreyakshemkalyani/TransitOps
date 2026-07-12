import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { drivers } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const driver = await db.query.drivers.findFirst({
      where: eq(drivers.id, id)
    });

    if (!driver) {
      return NextResponse.json({ success: false, message: "Driver not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, driver });
  } catch (error) {
    console.error("GET /api/drivers/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch driver" }, { status: 500 });
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
    if (body.contactNumber !== undefined) updateData.contactNumber = body.contactNumber;
    if (body.safetyScore !== undefined) updateData.safetyScore = parseFloat(body.safetyScore);
    
    const updated = await db.update(drivers)
      .set(updateData)
      .where(eq(drivers.id, id))
      .returning();

    return NextResponse.json({ success: true, driver: updated[0] });
  } catch (error) {
    console.error("PATCH /api/drivers/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to update driver" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    const deleted = await db.delete(drivers)
      .where(eq(drivers.id, id))
      .returning();
      
    return NextResponse.json({ success: true, driver: deleted[0] });
  } catch (error) {
    console.error("DELETE /api/drivers/[id] error:", error);
    return NextResponse.json({ success: false, message: "Cannot delete driver, likely due to existing trips." }, { status: 400 });
  }
}
