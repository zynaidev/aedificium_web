// lib/api-auth.ts
// Használat: const user = await getAuthUser()
// Ha nincs session, automatikusan 401-et dob.

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export type AuthUser = {
  id: string
  email: string
  name: string
  role: 'designer' | 'logistics' | 'admin'
  studio_name?: string | null
  is_active?: boolean
}

export async function getAuthUser(): Promise<AuthUser> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    throw new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const user = session.user as AuthUser

  if (user.is_active === false) {
    throw new Response(JSON.stringify({ error: 'Account inactive' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return user
}

export function requireRole(
  user: AuthUser,
  allowed: Array<'designer' | 'logistics' | 'admin'>
) {
  if (!allowed.includes(user.role)) {
    throw new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
