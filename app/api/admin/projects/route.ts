// app/api/admin/projects/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getAuthUser, requireRole } from '@/lib/api-auth'

export async function GET() {
  try {
    const user = await getAuthUser()
    requireRole(user, ['admin'])

    const { rows: projects } = await query(
      `SELECT p.id, p.name, p.ref_number, p.status, p.eta_date, p.studio_name,
              p.created_at, u.name AS architect_name, u.email AS architect_email
       FROM projects p
       JOIN "user" u ON u.id = p.architect_id
       ORDER BY p.created_at DESC`
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
    console.error('[/api/admin/projects GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser()
    requireRole(user, ['admin'])

    const { architect_id, name, studio_name, eta_date, brands_included } =
      await req.json()

    if (!architect_id || !name) {
      return NextResponse.json(
        { error: 'architect_id and name required' },
        { status: 400 }
      )
    }

    const { rows } = await query(
      `INSERT INTO projects (architect_id, studio_name, name, eta_date, brands_included)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, ref_number`,
      [
        architect_id,
        studio_name ?? null,
        name,
        eta_date ?? null,
        brands_included ?? null,
      ]
    )

    return NextResponse.json(rows[0], { status: 201 })
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[/api/admin/projects POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getAuthUser()
    requireRole(user, ['admin'])

    const { id, status, eta_date, brands_included } = await req.json()
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
    if (eta_date !== undefined) {
      updates.push(`eta_date = $${i++}`)
      values.push(eta_date)
    }
    if (brands_included !== undefined) {
      updates.push(`brands_included = $${i++}`)
      values.push(brands_included)
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    values.push(id)
    await query(
      `UPDATE projects SET ${updates.join(', ')} WHERE id = $${i}`,
      values
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[/api/admin/projects PATCH]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getAuthUser()
    requireRole(user, ['admin'])

    const { id } = await req.json()
    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 })
    }

    await query(`DELETE FROM projects WHERE id = $1`, [id])
    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[/api/admin/projects DELETE]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
