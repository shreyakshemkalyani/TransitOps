// Vehicle list API (GET) for /api/vehicles/list
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** GET /api/vehicles/list */
export async function GET(request) {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: { 
        drivers: true 
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({ success: true, vehicles }, { status: 200 });
  } catch (error) {
    console.error("GET /api/vehicles/list error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch vehicles" }, { status: 500 });
  }
}