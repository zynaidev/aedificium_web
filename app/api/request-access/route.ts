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

    await pool.query(
      `INSERT INTO access_requests
        (name, email, studio, website, project_type,
         location, timeline, requirements, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        name,
        email,
        studio,
        website,
        project_type,
        location,
        timeline,
        requirements,
        status || 'pending',
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Request access error:', error);
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}
