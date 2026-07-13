import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(`${process.env.LOCATION_FROM_IP}`, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    const data = await response.json();

    return NextResponse.json({
      latitude: data.latitude,
      longitude: data.longitude,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800',
      },
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}