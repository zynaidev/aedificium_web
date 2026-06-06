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

    const {
      id,
      status,
      cbm,
      weight_kg,
      pallet_count,
      tracking_number,
      notes,
      target_date,
    } = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 })
    }

    const updates: string[] = []
    const values: unknown[] = []
    let i = 1

    if (status !== undefined) {
      updates.push(`status = $${i++}`)
      values.push(status)
    }
    if (cbm !== undefined) {
      updates.push(`cbm = $${i++}`)
      values.push(cbm)
    }
    if (weight_kg !== undefined) {
      updates.push(`weight_kg = $${i++}`)
      values.push(weight_kg)
    }
    if (pallet_count !== undefined) {
      updates.push(`pallet_count = $${i++}`)
      values.push(pallet_count)
    }
    if (tracking_number !== undefined) {
      updates.push(`tracking_number = $${i++}`)
      values.push(tracking_number)
    }
    if (notes !== undefined) {
      updates.push(`notes = $${i++}`)
      values.push(notes)
    }
    if (target_date !== undefined) {
      updates.push(`target_date = $${i++}`)
      values.push(target_date || null)
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    values.push(id)
    await query(
      `UPDATE shipments SET ${updates.join(', ')} WHERE id = $${i}`,
      values
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[/api/admin/shipments PATCH]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
