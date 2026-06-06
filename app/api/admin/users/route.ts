// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { hashPassword } from 'better-auth/crypto'
import { query } from '@/lib/db'
import { getAuthUser, requireRole } from '@/lib/api-auth'

const ALLOWED_ROLES = ['designer', 'logistics'] as const

export async function GET() {
  try {
    const user = await getAuthUser()
    requireRole(user, ['admin'])

    const { rows } = await query(
      `SELECT id, name, email, role, studio_name, is_active, "createdAt"
       FROM "user"
       ORDER BY "createdAt" DESC`
    )

    return NextResponse.json(rows)
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[/api/admin/users GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser()
    requireRole(user, ['admin'])

    const { name, email, password, role, studio_name } = await req.json()
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'name, email, password and role required' },
        { status: 400 }
      )
    }
    if (!ALLOWED_ROLES.includes(role)) {
      return NextResponse.json(
        { error: "role must be 'designer' or 'logistics'" },
        { status: 400 }
      )
    }

    const userId = crypto.randomUUID()
    const hashed = await hashPassword(password)
    const normalizedEmail = email.toLowerCase()

    await query(
      `INSERT INTO "user" (id, name, email, "emailVerified", role, studio_name, is_active)
       VALUES ($1, $2, $3, true, $4, $5, true)`,
      [userId, name, normalizedEmail, role, studio_name || null]
    )

    await query(
      `INSERT INTO account (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
       VALUES ($1, $2, 'credential', $3, $4, NOW(), NOW())`,
      [crypto.randomUUID(), normalizedEmail, userId, hashed]
    )

    return NextResponse.json({ id: userId, email: normalizedEmail }, { status: 201 })
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[/api/admin/users POST]', err)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getAuthUser()
    requireRole(user, ['admin'])

    const { id, is_active } = await req.json()
    if (!id || typeof is_active !== 'boolean') {
      return NextResponse.json(
        { error: 'id and is_active (boolean) required' },
        { status: 400 }
      )
    }

    await query(`UPDATE "user" SET is_active = $1 WHERE id = $2`, [is_active, id])
    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[/api/admin/users PATCH]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
