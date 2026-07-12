// Vehicle detail API (GET, PUT, DELETE) for /api/vehicles/[id]
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** GET /api/vehicles/{id} */
export async function GET(request, { params }) {
  const { id } = params;
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: { drivers: true },
    });
    if (!vehicle) {
      return NextResponse.json({ success: false, error: "Vehicle not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, vehicle }, { status: 200 });
  } catch (error) {
    console.error(`GET /api/vehicles/${id} error:`, error);
    return NextResponse.json({ success: false, error: "Failed to fetch vehicle" }, { status: 500 });
  }
}

/** PUT /api/vehicles/{id}
 *  Updates vehicle fields. Body can contain any of:
 *   registrationNumber, make, model, year, status
 *  Validates unique registrationNumber if changed.
 */
export async function PUT(request, { params }) {
  const { id } = params;
  try {
    const body = await request.json();
    const { registrationNumber, make, model, year, status } = body;

    const data = {};
    if (registrationNumber !== undefined) data.registrationNumber = registrationNumber.trim();
    if (make !== undefined) data.make = make || null;
    if (model !== undefined) data.model = model || null;
    if (year !== undefined) data.year = year ? parseInt(year, 10) : null;
    if (status !== undefined) data.status = status;

    const updated = await prisma.vehicle.update({
      where: { id },
      data,
      include: { drivers: true },
    });
    return NextResponse.json({ success: true, vehicle: updated }, { status: 200 });
  } catch (error) {
    console.error(`PUT /api/vehicles/${id} error:`, error);
    if (error?.code === "P2002") {
      return NextResponse.json({ success: false, error: "Registration number must be unique" }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: "Failed to update vehicle" }, { status: 500 });
  }
}

/** DELETE /api/vehicles/{id} */
export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    await prisma.vehicle.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(`DELETE /api/vehicles/${id} error:`, error);
    return NextResponse.json({ success: false, error: "Failed to delete vehicle" }, { status: 500 });
  }
}
