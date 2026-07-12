// Vehicle collection API: GET list/search/filter, POST create
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** GET /api/vehicles
 *  Query params (optional):
 *   - search: matches registrationNumber, make, or model (case-insensitive)
 *   - status: filter by ACTIVE | IN_MAINTENANCE | INACTIVE
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    const where = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { registrationNumber: { contains: search, mode: "insensitive" } },
        { make: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
      ];
    }

    const vehicles = await prisma.vehicle.findMany({
      where,
      include: { drivers: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, vehicles }, { status: 200 });
  } catch (error) {
    console.error("GET /api/vehicles error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch vehicles" }, { status: 500 });
  }
}

/** POST /api/vehicles
 *  Creates a new vehicle. Expects JSON body:
 *   { registrationNumber, make?, model?, year?, status? }
 *  Validates:
 *   - registrationNumber required + unique (Prisma unique constraint)
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { registrationNumber, make, model, year, status = "ACTIVE" } = body;

    if (!registrationNumber || !registrationNumber.trim()) {
      return NextResponse.json({ success: false, error: "Registration number is required" }, { status: 400 });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        registrationNumber: registrationNumber.trim(),
        make: make || null,
        model: model || null,
        year: year ? parseInt(year, 10) : null,
        status,
      },
      include: { drivers: true },
    });
    return NextResponse.json({ success: true, vehicle }, { status: 201 });
  } catch (error) {
    console.error("POST /api/vehicles error:", error);
    if (error?.code === "P2002") {
      return NextResponse.json({ success: false, error: "Registration number must be unique" }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: "Failed to create vehicle" }, { status: 500 });
  }
}
