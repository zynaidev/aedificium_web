// app/api/files/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

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
  const uploadDir = process.env.UPLOAD_DIR
  if (!uploadDir) {
    return NextResponse.json({ error: 'Upload not configured' }, { status: 500 })
  }

  const { path: segments } = await params
  if (!segments?.length) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const resolved = path.resolve(uploadDir, ...segments)
  if (!resolved.startsWith(path.resolve(uploadDir))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const buffer = fs.readFileSync(resolved)
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': contentTypeFor(resolved),
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
