import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { maintenance, vehicles } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const record = await db.query.maintenance.findFirst({ where: eq(maintenance.id, id) });
    if (!record) return NextResponse.json({ success: false, message: "Record not found" }, { status: 404 });

    if (body.action === 'close') {
      await db.update(maintenance)
        .set({ status: 'Completed', endDate: new Date() })
        .where(eq(maintenance.id, id));

      // Restore vehicle to Available
      await db.update(vehicles).set({ status: 'Available' }).where(eq(vehicles.id, record.vehicleId));

      return NextResponse.json({ success: true, message: "Maintenance closed. Vehicle is now Available." });
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("PATCH /api/maintenance/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to update record" }, { status: 500 });
  }
}
