// app/api/claims/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getAuthUser, requireRole } from '@/lib/api-auth'

export async function GET() {
  try {
    const user = await getAuthUser()
    requireRole(user, ['designer', 'admin'])
    const isAdmin = user.role === 'admin'

    const { rows } = await query(
      isAdmin
        ? `SELECT c.*, u.name AS architect_name, p.name AS project_name
           FROM claims c
           JOIN "user" u ON u.id = c.architect_id
           LEFT JOIN projects p ON p.id = c.project_id
           ORDER BY c.created_at DESC`
        : `SELECT c.*, p.name AS project_name
           FROM claims c
           LEFT JOIN projects p ON p.id = c.project_id
           WHERE c.architect_id = $1
           ORDER BY c.created_at DESC`,
      isAdmin ? [] : [user.id]
    )

    return NextResponse.json(rows)
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[/api/claims GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser()
    requireRole(user, ['designer', 'admin'])

    const formData = await req.formData()
    const project_id  = formData.get('project_id') as string | null
    const item_name   = formData.get('item_name') as string | null
    const issue_type  = formData.get('issue_type') as string | null
    const description = formData.get('description') as string | null
    const file_url    = formData.get('file_url') as string | null

    if (!item_name || !issue_type) {
      return NextResponse.json({ error: 'item_name and issue_type required' }, { status: 400 })
    }

    if (project_id && user.role !== 'admin') {
      const { rows: ownRows } = await query(
        `SELECT id FROM projects WHERE id = $1 AND architect_id = $2`,
        [project_id, user.id]
      )
      if (ownRows.length === 0) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 })
      }
    }

    const { rows } = await query(
      `INSERT INTO claims (architect_id, project_id, item_name, issue_type, description, file_url)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [user.id, project_id || null, item_name, issue_type, description || null, file_url || null]
    )

    return NextResponse.json(rows[0], { status: 201 })
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[/api/claims POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getAuthUser()
    requireRole(user, ['admin'])

    const { id, status } = await req.json()
    if (!id || !status) return NextResponse.json({ error: 'id and status required' }, { status: 400 })

    await query(`UPDATE claims SET status = $1 WHERE id = $2`, [status, id])
    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[/api/claims PATCH]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
