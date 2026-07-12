// Driver collection API: GET list, POST create
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** GET /api/drivers
 *  Returns all drivers with optional vehicle relation.
 */
export async function GET() {
  try {
    const drivers = await prisma.driver.findMany({
      include: { vehicle: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, drivers }, { status: 200 });
  } catch (error) {
    console.error("GET /api/drivers error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch drivers" }, { status: 500 });
  }
}

/** POST /api/drivers
 *  Creates a new driver. Expects JSON body:
 *  { name, licenseNumber, licenseExpiry, status?, vehicleId? }
 *  Validates:
 *   - licenseNumber unique (handled by Prisma unique constraint)
 *   - licenseExpiry must be a future date
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, licenseNumber, licenseExpiry, status = "active", vehicleId } = body;

    if (!name || !licenseNumber || !licenseExpiry) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const expiryDate = new Date(licenseExpiry);
    if (isNaN(expiryDate.getTime())) {
      return NextResponse.json({ success: false, error: "Invalid licenseExpiry date" }, { status: 400 });
    }
    if (expiryDate < new Date()) {
      return NextResponse.json({ success: false, error: "License expiry must be in the future" }, { status: 400 });
    }

    const driver = await prisma.driver.create({
      data: {
        name,
        licenseNumber,
        licenseExpiry: expiryDate,
        status,
        vehicleId: vehicleId || null,
      },
      include: { vehicle: true },
    });
    return NextResponse.json({ success: true, driver }, { status: 201 });
  } catch (error) {
    console.error("POST /api/drivers error:", error);
    // Prisma unique constraint error code is 'P2002'
    if (error?.code === "P2002") {
      return NextResponse.json({ success: false, error: "License number must be unique" }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: "Failed to create driver" }, { status: 500 });
  }
}
