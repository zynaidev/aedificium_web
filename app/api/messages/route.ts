// app/api/messages/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getAuthUser } from '@/lib/api-auth'

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser()
    const shipmentId = new URL(req.url).searchParams.get('shipment_id')

    if (!shipmentId) return NextResponse.json({ error: 'shipment_id required' }, { status: 400 })

    if (user.role === 'designer') {
      const { rows } = await query(
        `SELECT id FROM shipments WHERE id = $1 AND architect_id = $2`,
        [shipmentId, user.id]
      )
      if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const { rows } = await query(
      `SELECT m.*, u.name AS sender_name
       FROM messages m
       JOIN "user" u ON u.id = m.sender_id
       WHERE m.shipment_id = $1
       ORDER BY m.created_at ASC`,
      [shipmentId]
    )

    // Olvasottnak jelöl
    await query(
      `UPDATE messages SET read_at = NOW()
       WHERE shipment_id = $1 AND sender_id != $2 AND read_at IS NULL`,
      [shipmentId, user.id]
    )

    return NextResponse.json(rows)
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[/api/messages GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser()
    const { shipment_id, message_body } = await req.json()

    if (!shipment_id || !message_body?.trim()) {
      return NextResponse.json({ error: 'shipment_id and message_body required' }, { status: 400 })
    }

    if (user.role === 'designer') {
      const { rows } = await query(
        `SELECT id FROM shipments WHERE id = $1 AND architect_id = $2`,
        [shipment_id, user.id]
      )
      if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const { rows } = await query(
      `INSERT INTO messages (shipment_id, sender_id, sender_role, message_body)
       VALUES ($1, $2, $3, $4)
       RETURNING id, created_at`,
      [shipment_id, user.id, user.role, message_body.trim()]
    )

    return NextResponse.json({
      ...rows[0],
      sender_name: user.name,
      sender_role: user.role,
      message_body: message_body.trim(),
    }, { status: 201 })
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[/api/messages POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
