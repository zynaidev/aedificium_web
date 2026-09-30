import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const pool = new Pool({
  host: process.env.AEDIFICIUM_DB_HOST,
  port: Number(process.env.AEDIFICIUM_DB_PORT),
  database: process.env.AEDIFICIUM_DB_NAME,
  user: process.env.AEDIFICIUM_DB_USER,
  password: process.env.AEDIFICIUM_DB_PASSWORD,
  ssl: false,
});

const MIN_FILL_TIME_MS = 3000; // faster than this = scripted submit
const MAX_FORM_AGE_MS = 6 * 60 * 60 * 1000; // older than this = stale/replayed token

function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get('origin') ?? request.headers.get('referer');
  if (!origin) return false;
  try {
    const host = new URL(origin).host;
    const allowedHost = new URL(
      process.env.NEXT_PUBLIC_APP_URL || 'https://aedificium.design'
    ).host;
    return host === allowedHost;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);

    // Per-IP throttling: legitimate applicants submit this form once, not repeatedly.
    if (!rateLimit(`request-access:${ip}`, 3, 10 * 60 * 1000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    if (!rateLimit(`request-access-day:${ip}`, 10, 24 * 60 * 60 * 1000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    if (!isAllowedOrigin(request)) {
      return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      email,
      studio,
      website,
      project_type,
      location,
      timeline,
      requirements,
      status,
      hp_field,
      form_rendered_at,
      math_a,
      math_b,
      math_answer,
    } = body;

    // Honeypot: real users never see or fill this field. Pretend success to
    // avoid tipping bots off that they were caught.
    if (typeof hp_field === 'string' && hp_field.trim().length > 0) {
      return NextResponse.json({ success: true });
    }

    // Timing check: must have taken a human-plausible amount of time to fill
    // the form, and the timestamp itself must not be missing/stale/forged-old.
    const renderedAt = Number(form_rendered_at);
    if (!renderedAt || Number.isNaN(renderedAt)) {
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
    }
    const elapsed = Date.now() - renderedAt;
    if (elapsed < MIN_FILL_TIME_MS || elapsed > MAX_FORM_AGE_MS) {
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
    }

    // Math verification challenge.
    const a = Number(math_a);
    const b = Number(math_b);
    const answer = Number(math_answer);
    if (
      !Number.isInteger(a) ||
      !Number.isInteger(b) ||
      a < 1 ||
      a > 9 ||
      b < 1 ||
      b > 9 ||
      !Number.isFinite(answer) ||
      answer !== a + b
    ) {
      return NextResponse.json({ error: 'Incorrect verification answer' }, { status: 422 });
    }

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Invalid name" },
        { status: 400 }
      );
    }
    if (
      !email ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: "Invalid email" },
        { status: 400 }
      );
    }
    if (!studio || typeof studio !== "string" || studio.trim().length < 2) {
      return NextResponse.json(
        { error: "Invalid studio name" },
        { status: 400 }
      );
    }
    if (!project_type || typeof project_type !== "string") {
      return NextResponse.json(
        { error: "Project type required" },
        { status: 400 }
      );
    }

    // Sanitize string lengths
    const safe = {
      name: name.trim().slice(0, 100),
      email: email.trim().toLowerCase().slice(0, 200),
      studio: studio.trim().slice(0, 200),
      website: (website || "").trim().slice(0, 500),
      project_type: project_type.trim().slice(0, 100),
      location: (location || "").trim().slice(0, 200),
      timeline: (timeline || "").trim().slice(0, 100),
      requirements: (requirements || "").slice(0, 500),
      status: "pending",
    };

    await pool.query(
      `INSERT INTO access_requests
        (name, email, studio, website, project_type,
         location, timeline, requirements, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        safe.name,
        safe.email,
        safe.studio,
        safe.website,
        safe.project_type,
        safe.location,
        safe.timeline,
        safe.requirements,
        safe.status,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Request access error:', error);
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}
