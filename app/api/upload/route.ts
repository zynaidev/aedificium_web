// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getAuthUser, requireRole } from '@/lib/api-auth'

const ALLOWED_TYPES = ['boq', 'invoice', 'claim'] as const

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser()
    requireRole(user, ['admin', 'designer'])

    const formData = await req.formData()
    const file = formData.get('file')
    const type = formData.get('type')
    const userId = formData.get('userId')

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'file required' }, { status: 400 })
    }
    if (
      typeof type !== 'string' ||
      !ALLOWED_TYPES.includes(type as (typeof ALLOWED_TYPES)[number])
    ) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }
    if (typeof userId !== 'string' || !userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    const uploadDir = process.env.UPLOAD_DIR
    const baseUrl = process.env.UPLOAD_BASE_URL
    if (!uploadDir || !baseUrl) {
      return NextResponse.json({ error: 'Upload not configured' }, { status: 500 })
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'bin'
    const filename = `${type}_${Date.now()}.${ext}`
    const relativePath = `${userId}/${filename}`
    const fullDir = path.join(uploadDir, userId)
    const fullPath = path.join(uploadDir, relativePath)

    fs.mkdirSync(fullDir, { recursive: true })

    const buffer = Buffer.from(await file.arrayBuffer())
    fs.writeFileSync(fullPath, buffer)

    const url = `${baseUrl}/uploads/${relativePath}`
    return NextResponse.json({ url })
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[/api/upload POST]', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
