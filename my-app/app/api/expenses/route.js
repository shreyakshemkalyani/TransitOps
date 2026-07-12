import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { expenses, vehicles } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const allExpenses = await db.query.expenses.findMany({
      with: { vehicle: true },
      orderBy: [desc(expenses.createdAt)],
    });

    return NextResponse.json({ success: true, expenses: allExpenses });
  } catch (error) {
    console.error("GET /api/expenses error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch expenses" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const newExpense = await db.insert(expenses).values({
      category: body.category || 'Fuel',
      amount: Number(body.amount || 0),
      date: new Date(body.date || new Date()),
      vehicleId: body.vehicleId || null,
    }).returning();

    return NextResponse.json({ success: true, expense: newExpense[0] }, { status: 201 });
  } catch (error) {
    console.error("POST /api/expenses error:", error);
    return NextResponse.json({ success: false, message: "Failed to create expense" }, { status: 500 });
  }
}
