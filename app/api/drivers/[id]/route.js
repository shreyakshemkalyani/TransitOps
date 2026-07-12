// Driver detail API (GET, PUT, DELETE) for /api/drivers/[id]
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** GET /api/drivers/{id}
 *  Retrieves a single driver by ID, including its assigned vehicle.
 */
export async function GET(request, { params }) {
  const { id } = params;
  try {
    const driver = await prisma.driver.findUnique({
      where: { id },
      include: { vehicle: true },
    });
    if (!driver) {
      return NextResponse.json({ success: false, error: "Driver not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, driver }, { status: 200 });
  } catch (error) {
    console.error(`GET /api/drivers/${id} error:`, error);
    return NextResponse.json({ success: false, error: "Failed to fetch driver" }, { status: 500 });
  }
}

/** PUT /api/drivers/{id}
 *  Updates driver fields. Body can contain any of:
 *   name, licenseNumber, licenseExpiry, status, vehicleId
 *  Validates license expiry date if supplied and ensures unique licenseNumber.
 */
export async function PUT(request, { params }) {
  const { id } = params;
  try {
    const body = await request.json();
    const { name, licenseNumber, licenseExpiry, status, vehicleId } = body;

    const data = {};
    if (name !== undefined) data.name = name;
    if (licenseNumber !== undefined) data.licenseNumber = licenseNumber;
    if (licenseExpiry !== undefined) {
      const expiryDate = new Date(licenseExpiry);
      if (isNaN(expiryDate.getTime())) {
        return NextResponse.json({ success: false, error: "Invalid licenseExpiry date" }, { status: 400 });
      }
      if (expiryDate < new Date()) {
        return NextResponse.json({ success: false, error: "License expiry must be in the future" }, { status: 400 });
      }
      data.licenseExpiry = expiryDate;
    }
    if (status !== undefined) data.status = status;
    if (vehicleId !== undefined) data.vehicleId = vehicleId;

    const updated = await prisma.driver.update({
      where: { id },
      data,
      include: { vehicle: true },
    });
    return NextResponse.json({ success: true, driver: updated }, { status: 200 });
  } catch (error) {
    console.error(`PUT /api/drivers/${id} error:`, error);
    if (error?.code === "P2002") {
      return NextResponse.json({ success: false, error: "License number must be unique" }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: "Failed to update driver" }, { status: 500 });
  }
}

/** DELETE /api/drivers/{id}
 *  Removes a driver record. Returns 204 on success.
 */
export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    await prisma.driver.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(`DELETE /api/drivers/${id} error:`, error);
    return NextResponse.json({ success: false, error: "Failed to delete driver" }, { status: 500 });
  }
}
