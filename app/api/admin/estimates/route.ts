// app/api/admin/estimates/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getAuthUser, requireRole } from '@/lib/api-auth'

export async function GET() {
  try {
    const user = await getAuthUser()
    requireRole(user, ['admin'])

    const { rows } = await query(
      `SELECT e.*, u.name AS architect_name, u.email AS architect_email
       FROM estimates e
       JOIN "user" u ON u.id = e.architect_id
       ORDER BY e.created_at DESC`
    )

    const ids = rows.map((e: Record<string, unknown>) => e.id)
    let items: Record<string, unknown>[] = []
    if (ids.length > 0) {
      const { rows: itemRows } = await query(
        `SELECT * FROM quote_items WHERE estimate_id = ANY($1::uuid[]) ORDER BY created_at ASC`,
        [ids]
      )
      items = itemRows
    }

    const result = rows.map((e: Record<string, unknown>) => ({
      ...e,
      quote_items: items.filter((i) => i.estimate_id === e.id),
    }))

    return NextResponse.json(result)
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[/api/admin/estimates GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getAuthUser()
    requireRole(user, ['admin'])

    const { id, status, total_value_eur, invoice_url } = await req.json()
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
    if (total_value_eur !== undefined) {
      updates.push(`total_value_eur = $${i++}`)
      values.push(total_value_eur)
    }
    if (invoice_url !== undefined) {
      updates.push(`invoice_url = $${i++}`)
      values.push(invoice_url)
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    values.push(id)
    await query(
      `UPDATE estimates SET ${updates.join(', ')} WHERE id = $${i}`,
      values
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[/api/admin/estimates PATCH]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
