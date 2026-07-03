import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const latitude = searchParams.get("latitude");
    const longitude = searchParams.get("longitude");
    const url = new URL(`${process.env.LOCATION_FROM_OPEN_METEO_API}`);

    url.searchParams.set("latitude", latitude);
    url.searchParams.set("longitude", longitude);
    url.searchParams.set(
      "current",
      "temperature_2m,weather_code,is_day,cloud_cover,wind_speed_10m",
    );
    url.searchParams.set("daily", "sunrise,sunset");
    url.searchParams.set("timezone", "auto");

    const response = await fetch(url);
    const data = await response.json();

    return NextResponse.json(data);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}