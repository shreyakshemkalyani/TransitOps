import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trips } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request, { params }) {
  const { id } = await params;
  const tripResult = await db.select().from(trips).where(eq(trips.id, id));
  
  if (tripResult.length === 0) {
    return NextResponse.json(
      { success: false, message: "Trip not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, trip: tripResult[0] });
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const { route, vehicle, driver, cargoWeight, distanceKm, status, time } = body;

  const updateData = {};
  if (route !== undefined) updateData.route = route;
  if (vehicle !== undefined) updateData.vehicle = vehicle;
  if (driver !== undefined) updateData.driver = driver;
  if (cargoWeight !== undefined) updateData.cargoWeight = Number(cargoWeight);
  if (distanceKm !== undefined) updateData.distanceKm = Number(distanceKm);
  if (status !== undefined) updateData.status = status;
  if (time !== undefined) updateData.time = time;
  updateData.updatedAt = new Date();

  const tripResult = await db.update(trips)
    .set(updateData)
    .where(eq(trips.id, id))
    .returning();

  return NextResponse.json({ success: true, trip: tripResult[0] });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  await db.delete(trips).where(eq(trips.id, id));

  return NextResponse.json({ success: true, message: "Trip deleted." });
}