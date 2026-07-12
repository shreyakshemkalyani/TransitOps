import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { message: "Login endpoint scaffolded. Configure credentials in lib/auth.js." },
    { status: 501 },
  );
}
