// app/api/admin/claims/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getAuthUser, requireRole } from '@/lib/api-auth'

const ALLOWED_STATUSES = [
  'Open',
  'Under Investigation',
  'Awaiting Parts',
  'Resolved',
  'Closed',
] as const

export async function GET() {
  try {
    const user = await getAuthUser()
    requireRole(user, ['admin'])

    const { rows } = await query(
      `SELECT c.*, u.name AS architect_name, u.email AS architect_email, p.name AS project_name
       FROM claims c
       JOIN "user" u ON u.id = c.architect_id
       LEFT JOIN projects p ON p.id = c.project_id
       ORDER BY c.created_at DESC`
    )

    return NextResponse.json(rows)
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[/api/admin/claims GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getAuthUser()
    requireRole(user, ['admin'])

    const { id, status } = await req.json()
    if (!id || !status) {
      return NextResponse.json({ error: 'id and status required' }, { status: 400 })
    }
    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 })
    }

    await query(`UPDATE claims SET status = $1 WHERE id = $2`, [status, id])
    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[/api/admin/claims PATCH]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
