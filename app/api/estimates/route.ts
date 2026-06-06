// app/api/estimates/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getAuthUser, requireRole } from '@/lib/api-auth'
import { uploadFile, buildFileKey } from '@/lib/r2'

export async function GET() {
  try {
    const user = await getAuthUser()
    const isAdmin = user.role === 'admin'

    const { rows } = await query(
      isAdmin
        ? `SELECT e.*, u.name AS architect_name, u.email AS architect_email
           FROM estimates e JOIN "user" u ON u.id = e.architect_id
           ORDER BY e.created_at DESC`
        : `SELECT * FROM estimates WHERE architect_id = $1 ORDER BY created_at DESC`,
      isAdmin ? [] : [user.id]
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
    console.error('[/api/estimates GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser()
    requireRole(user, ['designer', 'admin'])

    const formData = await req.formData()
    const projectName = formData.get('project_name') as string | null
    const file = formData.get('file') as File | null

    if (!projectName || !file) {
      return NextResponse.json({ error: 'project_name and file required' }, { status: 400 })
    }

    const key = buildFileKey(user.id, 'boq', file.name)
    const buffer = Buffer.from(await file.arrayBuffer())
    const fileUrl = await uploadFile(key, buffer, file.type || 'application/octet-stream')

    const { rows } = await query(
      `INSERT INTO estimates (architect_id, project_name, file_url) VALUES ($1, $2, $3) RETURNING id`,
      [user.id, projectName, fileUrl]
    )

    return NextResponse.json(rows[0], { status: 201 })
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[/api/estimates POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getAuthUser()
    const contentType = req.headers.get('content-type') ?? ''

    let id: string
    let status: string | undefined
    let total_value_eur: number | undefined
    let invoiceFileUrl: string | undefined

    if (contentType.includes('multipart/form-data')) {
      requireRole(user, ['admin'])
      const formData = await req.formData()
      id = formData.get('id') as string
      status = formData.get('status') as string | undefined
      const invoiceFile = formData.get('invoice') as File | null
      if (invoiceFile) {
        const key = buildFileKey(user.id, 'invoice', invoiceFile.name)
        const buffer = Buffer.from(await invoiceFile.arrayBuffer())
        invoiceFileUrl = await uploadFile(key, buffer, invoiceFile.type || 'application/pdf')
      }
    } else {
      const body = await req.json()
      id = body.id
      status = body.status
      total_value_eur = body.total_value_eur
    }

    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    if (user.role !== 'admin') {
      const { rows } = await query(
        `SELECT id FROM estimates WHERE id = $1 AND architect_id = $2`,
        [id, user.id]
      )
      if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      if (status !== 'Approved') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const fields: Record<string, unknown> = {}
    if (status) fields.status = status
    if (total_value_eur !== undefined) fields.total_value_eur = total_value_eur
    if (invoiceFileUrl) fields.invoice_url = invoiceFileUrl

    if (Object.keys(fields).length === 0) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })

    const entries = Object.entries(fields)
    const setClauses = entries.map(([k], i) => `${k} = $${i + 2}`).join(', ')
    await query(`UPDATE estimates SET ${setClauses} WHERE id = $1`, [id, ...entries.map(([, v]) => v)])

    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[/api/estimates PATCH]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
