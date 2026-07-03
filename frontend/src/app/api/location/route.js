import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(`${process.env.LOCATION_FROM_IP}`, {
      cache: "no-store",
    });

    const data = await response.json();

    return NextResponse.json({
      latitude: data.latitude,
      longitude: data.longitude,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}