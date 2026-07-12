import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trips } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allTrips = await db.query.trips.findMany({
      orderBy: [desc(trips.createdAt)],
    });

    return NextResponse.json({
      success: true,
      trips: allTrips,
    });
  } catch (error) {
    console.error("GET /api/trips error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch trips.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      route,
      vehicle,
      driver,
      cargoWeight,
      distanceKm,
      status,
      time,
    } = body;

    if (!route || route.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          message: "Route is required.",
        },
        { status: 400 }
      );
    }

    const newTrip = await db.insert(trips).values({
      route: route.trim(),
      vehicle: vehicle || null,
      driver: driver || null,
      cargoWeight: Number(cargoWeight ?? 0),
      distanceKm: Number(distanceKm ?? 0),
      status: status || "DRAFT",
      time: time || "",
    }).returning();

    return NextResponse.json(
      {
        success: true,
        trip: newTrip[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/trips error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create trip.",
      },
      { status: 500 }
    );
  }
}