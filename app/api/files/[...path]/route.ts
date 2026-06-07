// app/api/files/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getAuthUser } from '@/lib/api-auth'

const MIME: Record<string, string> = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  csv: 'text/csv',
  txt: 'text/plain',
  zip: 'application/zip',
}

function contentTypeFor(filePath: string): string {
  const ext = path.extname(filePath).slice(1).toLowerCase()
  return MIME[ext] ?? 'application/octet-stream'
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    await getAuthUser()

    const uploadDir = process.env.UPLOAD_DIR
    if (!uploadDir) {
      return NextResponse.json({ error: 'Upload not configured' }, { status: 500 })
    }

    const { path: segments } = await params
    if (!segments?.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const resolvedUploadDir = path.resolve(uploadDir)
    const resolvedFilePath = path.resolve(path.join(uploadDir, ...segments))
    const relative = path.relative(resolvedUploadDir, resolvedFilePath)
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (!fs.existsSync(resolvedFilePath) || !fs.statSync(resolvedFilePath).isFile()) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const buffer = fs.readFileSync(resolvedFilePath)
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentTypeFor(resolvedFilePath),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[/api/files GET]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
