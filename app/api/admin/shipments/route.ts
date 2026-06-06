// app/api/admin/shipments/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getAuthUser, requireRole } from '@/lib/api-auth'

export async function GET() {
  try {
    const user = await getAuthUser()
    requireRole(user, ['admin', 'logistics'])

    const { rows } = await query(
      `SELECT s.*, p.name AS project_name, p.ref_number,
              u.name AS architect_name, u.email AS architect_email
       FROM shipments s
       JOIN projects p ON p.id = s.project_id
       JOIN "user" u ON u.id = s.architect_id
       ORDER BY s.created_at DESC`
    )

    return NextResponse.json(rows)
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[/api/admin/shipments GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getAuthUser()
    requireRole(user, ['admin', 'logistics'])

    const body = await req.json()
    const { id, ...fields } = body

    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 })
    }

    const allowed = [
      'status',
      'cbm',
      'weight_kg',
      'pallet_count',
      'package_dimensions',
      'tracking_number',
      'notes',
      'target_date',
      'destination_address',
      'contact_name',
    ]

    const updates = Object.entries(fields).filter(([k]) => allowed.includes(k))

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    const setClauses = updates.map(([k], idx) => `${k} = $${idx + 2}`).join(', ')
    const values = updates.map(([k, v]) => (k === 'target_date' ? v || null : v))

    await query(`UPDATE shipments SET ${setClauses} WHERE id = $1`, [id, ...values])

    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[/api/admin/shipments PATCH]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
