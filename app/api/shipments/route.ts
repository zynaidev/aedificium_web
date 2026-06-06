// app/api/shipments/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getAuthUser, requireRole } from '@/lib/api-auth'

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser()
    const projectId = new URL(req.url).searchParams.get('project_id')
    const privileged = user.role === 'admin' || user.role === 'logistics'

    let sql: string
    let params: unknown[]

    if (projectId) {
      sql = privileged
        ? `SELECT * FROM shipments WHERE project_id = $1 ORDER BY created_at DESC`
        : `SELECT * FROM shipments WHERE project_id = $1 AND architect_id = $2 ORDER BY created_at DESC`
      params = privileged ? [projectId] : [projectId, user.id]
    } else {
      sql = privileged
        ? `SELECT s.*, p.name AS project_name, p.ref_number,
                  u.name AS architect_name, u.email AS architect_email
           FROM shipments s
           JOIN projects p ON p.id = s.project_id
           JOIN "user" u ON u.id = s.architect_id
           ORDER BY s.created_at DESC`
        : `SELECT s.*, p.name AS project_name, p.ref_number
           FROM shipments s
           JOIN projects p ON p.id = s.project_id
           WHERE s.architect_id = $1
           ORDER BY s.created_at DESC`
      params = privileged ? [] : [user.id]
    }

    const { rows } = await query(sql, params)
    return NextResponse.json(rows)
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[/api/shipments GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser()
    requireRole(user, ['designer', 'admin'])

    const body = await req.json()
    const { project_id, shipment_ref, destination_type, destination_address, contact_name, target_date } = body

    if (!project_id || !shipment_ref) {
      return NextResponse.json({ error: 'project_id and shipment_ref required' }, { status: 400 })
    }

    if (user.role !== 'admin') {
      const { rows } = await query(
        `SELECT id FROM projects WHERE id = $1 AND architect_id = $2`,
        [project_id, user.id]
      )
      if (rows.length === 0) return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const { rows } = await query(
      `INSERT INTO shipments (project_id, architect_id, shipment_ref, destination_type, destination_address, contact_name, target_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [project_id, user.id, shipment_ref, destination_type ?? null, destination_address ?? null, contact_name ?? null, target_date ?? null]
    )

    return NextResponse.json(rows[0], { status: 201 })
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[/api/shipments POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getAuthUser()
    requireRole(user, ['logistics', 'admin'])

    const body = await req.json()
    const { id, ...fields } = body
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const allowed = ['status','cbm','weight_kg','pallet_count','package_dimensions','tracking_number','notes','target_date','destination_address']
    const updates = Object.entries(fields).filter(([k]) => allowed.includes(k))
    if (updates.length === 0) return NextResponse.json({ error: 'No valid fields' }, { status: 400 })

    const setClauses = updates.map(([k], i) => `${k} = $${i + 2}`).join(', ')
    await query(`UPDATE shipments SET ${setClauses} WHERE id = $1`, [id, ...updates.map(([, v]) => v)])

    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[/api/shipments PATCH]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
