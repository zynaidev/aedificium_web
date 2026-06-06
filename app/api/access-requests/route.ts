// app/api/access-requests/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getAuthUser, requireRole } from '@/lib/api-auth'

const ALLOWED_STATUSES = ['approved', 'rejected', 'pending'] as const

export async function GET() {
  try {
    const user = await getAuthUser()
    requireRole(user, ['admin'])

    const { rows } = await query(
      `SELECT id, name, email, studio, website, project_type, location, timeline,
              requirements, status, created_at
       FROM access_requests
       ORDER BY created_at DESC`
    )

    return NextResponse.json(rows)
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[/api/access-requests GET]', err)
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
      return NextResponse.json(
        { error: "status must be 'approved', 'rejected', or 'pending'" },
        { status: 400 }
      )
    }

    await query(`UPDATE access_requests SET status = $1 WHERE id = $2`, [status, id])
    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[/api/access-requests PATCH]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
