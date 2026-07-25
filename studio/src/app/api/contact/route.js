import { NextResponse } from "next/server";

export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const cleanString = (value, maxLength = 500) => {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
};

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const payload = {
    name: cleanString(body.name, 100),
    email: cleanString(body.email, 160).toLowerCase(),
    organization: cleanString(body.organization, 160),
    role: cleanString(body.role, 100),
    deadline: cleanString(body.deadline, 120),
    details: cleanString(body.details, 2000),
    budget: cleanString(body.budget, 80),
    services: Array.isArray(body.services)
      ? body.services
          .map((item) => cleanString(item, 80))
          .filter(Boolean)
          .slice(0, 8)
      : [],
    source: "portfolio-contact",
    submittedAt: new Date().toISOString(),
  };

  if (!payload.name || !EMAIL_PATTERN.test(payload.email) || !payload.details) {
    return NextResponse.json(
      {
        error: "Please include your name, a valid email, and project details.",
      },
      { status: 422 },
    );
  }

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;

  if (!webhookUrl) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Contact delivery is not configured yet." },
        { status: 503 },
      );
    }

    console.info("Contact inquiry received:", payload);
    return NextResponse.json({ ok: true, delivery: "development-log" });
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Unable to deliver the contact request right now." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, delivery: "webhook" });
}
