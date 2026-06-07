import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.AEDIFICIUM_DB_HOST,
  port: Number(process.env.AEDIFICIUM_DB_PORT),
  database: process.env.AEDIFICIUM_DB_NAME,
  user: process.env.AEDIFICIUM_DB_USER,
  password: process.env.AEDIFICIUM_DB_PASSWORD,
  ssl: false,
});

export async function POST(request: Request) {
  try {
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
    } = body;

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
