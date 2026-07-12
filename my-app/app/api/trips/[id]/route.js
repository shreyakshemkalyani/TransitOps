import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trips, vehicles, drivers } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const trip = await db.query.trips.findFirst({
      where: eq(trips.id, id),
      with: { vehicleRel: true, driverRel: true }
    });

    if (!trip) return NextResponse.json({ success: false, message: "Trip not found" }, { status: 404 });
    return NextResponse.json({ success: true, trip });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch trip" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { action } = await request.json(); // action can be 'dispatch', 'complete', 'cancel'
    
    const trip = await db.query.trips.findFirst({ where: eq(trips.id, id) });
    if (!trip) return NextResponse.json({ success: false, message: "Trip not found" }, { status: 404 });

    if (action === 'dispatch') {
      if (trip.status !== 'Draft') return NextResponse.json({ success: false, message: "Only Draft trips can be dispatched" }, { status: 400 });
      
      // Mark Trip, Vehicle, and Driver as On Trip
      await db.update(trips).set({ status: 'Dispatched' }).where(eq(trips.id, id));
      await db.update(vehicles).set({ status: 'On Trip' }).where(eq(vehicles.id, trip.vehicleId));
      await db.update(drivers).set({ status: 'On Trip' }).where(eq(drivers.id, trip.driverId));
      
      return NextResponse.json({ success: true, message: "Trip dispatched successfully" });
    }

    if (action === 'complete') {
      if (trip.status !== 'Dispatched') return NextResponse.json({ success: false, message: "Only Dispatched trips can be completed" }, { status: 400 });
      
      await db.update(trips).set({ status: 'Completed' }).where(eq(trips.id, id));
      await db.update(vehicles).set({ status: 'Available' }).where(eq(vehicles.id, trip.vehicleId));
      await db.update(drivers).set({ status: 'Available' }).where(eq(drivers.id, trip.driverId));
      
      return NextResponse.json({ success: true, message: "Trip completed" });
    }

    if (action === 'cancel') {
      await db.update(trips).set({ status: 'Cancelled' }).where(eq(trips.id, id));
      
      if (trip.status === 'Dispatched') {
         await db.update(vehicles).set({ status: 'Available' }).where(eq(vehicles.id, trip.vehicleId));
         await db.update(drivers).set({ status: 'Available' }).where(eq(drivers.id, trip.driverId));
      }
      return NextResponse.json({ success: true, message: "Trip cancelled" });
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("PATCH /api/trips/[id] error:", error);
    return NextResponse.json({ success: false, message: "Failed to update trip" }, { status: 500 });
  }
}