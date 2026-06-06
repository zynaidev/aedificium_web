// app/api/admin/quote-items/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getAuthUser, requireRole } from '@/lib/api-auth'

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser()
    requireRole(user, ['admin'])

    const {
      estimate_id,
      brand,
      item_description,
      quantity,
      rrp_eur,
      discount_percent,
      unit_price_eur,
      lead_time_weeks,
    } = await req.json()

    if (
      !estimate_id ||
      !brand ||
      !item_description ||
      quantity === undefined ||
      rrp_eur === undefined ||
      discount_percent === undefined ||
      unit_price_eur === undefined
    ) {
      return NextResponse.json(
        {
          error:
            'estimate_id, brand, item_description, quantity, rrp_eur, discount_percent and unit_price_eur required',
        },
        { status: 400 }
      )
    }

    const { rows } = await query(
      `INSERT INTO quote_items
        (estimate_id, brand, item_description, quantity, rrp_eur, discount_percent, unit_price_eur, lead_time_weeks)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [
        estimate_id,
        brand,
        item_description,
        quantity,
        rrp_eur,
        discount_percent,
        unit_price_eur,
        lead_time_weeks ?? null,
      ]
    )

    return NextResponse.json(rows[0], { status: 201 })
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[/api/admin/quote-items POST]', err)
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

    await query(`DELETE FROM quote_items WHERE id = $1`, [id])
    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[/api/admin/quote-items DELETE]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
