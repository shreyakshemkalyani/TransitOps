import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { drivers } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const allDrivers = await db.query.drivers.findMany({
      orderBy: [desc(drivers.createdAt)],
    });

    return NextResponse.json({
      success: true,
      drivers: allDrivers,
    });
  } catch (error) {
    console.error("GET /api/drivers error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch drivers" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    const existing = await db.query.drivers.findFirst({
      where: eq(drivers.licenseNo, body.licenseNo)
    });
    
    if (existing) {
      return NextResponse.json({ success: false, message: "License number already exists." }, { status: 400 });
    }

    const newDriver = await db.insert(drivers).values({
      name: body.name,
      licenseNo: body.licenseNo,
      category: body.category,
      expiryDate: new Date(body.expiryDate),
      contactNumber: body.contactNumber,
      status: body.status || 'Available',
      tripCompletionRate: 100.0, // Initial score
      safetyScore: 100.0 // Assuming safety score column
    }).returning();

    return NextResponse.json({ success: true, driver: newDriver[0] });
  } catch (error) {
    console.error("POST /api/drivers error:", error);
    return NextResponse.json({ success: false, message: "Failed to add driver" }, { status: 500 });
  }
}
