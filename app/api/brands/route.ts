import { NextResponse } from 'next/server';
import { Pool } from 'pg';

let pool: Pool | null = null;
pool = null; // force reset

function getPool() {
  if (!pool) {
    pool = new Pool({
      host: process.env.AEDIFICIUM_DB_HOST,
      port: Number(process.env.AEDIFICIUM_DB_PORT),
      database: process.env.AEDIFICIUM_DB_NAME,
      user: process.env.AEDIFICIUM_DB_USER,
      password: process.env.AEDIFICIUM_DB_PASSWORD,
      ssl: false,
    });
  }
  return pool;
}

// NOTE: This endpoint is intentionally public (no getAuthUser()).
// The brand library is consumed by both the public /brands marketing
// page and the authenticated OS dashboard, so it must remain unauthenticated.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoriesOnly = searchParams.get('categories');

  try {
    if (categoriesOnly === 'true') {
      const result = await getPool().query(
        'SELECT DISTINCT category FROM brands WHERE category IS NOT NULL ORDER BY category ASC'
      );
      return NextResponse.json(
        result.rows.map((r: { category: string }) => r.category)
      );
    }

    const result = await getPool().query(
      'SELECT brand_id, name, category, url FROM brands ORDER BY name ASC'
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('DB error:', error);
    return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
  }
}