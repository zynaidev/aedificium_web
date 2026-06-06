// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getAuthUser, requireRole } from '@/lib/api-auth'

export async function GET() {
  try {
    const user = await getAuthUser()
    requireRole(user, ['designer', 'admin'])
    const privileged = user.role === 'admin'

    const { rows: projects } = await query(
      privileged
        ? `SELECT p.*, u.name AS architect_name, u.email AS architect_email
           FROM projects p
           JOIN "user" u ON u.id = p.architect_id
           ORDER BY p.created_at DESC`
        : `SELECT * FROM projects WHERE architect_id = $1 ORDER BY created_at DESC`,
      privileged ? [] : [user.id]
    )

    const ids = projects.map((p: Record<string, unknown>) => p.id)
    let shipments: Record<string, unknown>[] = []
    if (ids.length > 0) {
      const { rows } = await query(
        `SELECT * FROM shipments WHERE project_id = ANY($1::uuid[]) ORDER BY created_at DESC`,
        [ids]
      )
      shipments = rows
    }

    const result = projects.map((p: Record<string, unknown>) => ({
      ...p,
      shipments: shipments.filter((s) => s.project_id === p.id),
    }))

    return NextResponse.json(result)
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[/api/projects GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser()
    requireRole(user, ['admin'])

    const body = await req.json()
    const { architect_id, studio_name, name, eta_date, brands_included } = body

    if (!architect_id || !name) {
      return NextResponse.json({ error: 'architect_id and name required' }, { status: 400 })
    }

    const { rows } = await query(
      `INSERT INTO projects (architect_id, studio_name, name, eta_date, brands_included)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, ref_number`,
      [architect_id, studio_name ?? null, name, eta_date ?? null, brands_included ?? null]
    )

    return NextResponse.json(rows[0], { status: 201 })
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[/api/projects POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
