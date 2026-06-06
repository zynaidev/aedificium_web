import fs from 'fs'
import path from 'path'

export async function uploadFile(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string
): Promise<string> {
  const uploadDir = process.env.UPLOAD_DIR!
  const fullPath = path.join(uploadDir, key)
  fs.mkdirSync(path.dirname(fullPath), { recursive: true })
  fs.writeFileSync(fullPath, body)
  return `${process.env.UPLOAD_BASE_URL}/uploads/${key}`
}

export async function getSignedDownloadUrl(key: string): Promise<string> {
  return `${process.env.UPLOAD_BASE_URL}/uploads/${key}`
}

export function buildFileKey(
  userId: string,
  type: 'boq' | 'invoice' | 'claim',
  originalFilename: string
): string {
  const ext = originalFilename.split('.').pop()?.toLowerCase() ?? 'bin'
  return `${userId}/${type}_${Date.now()}.${ext}`
}
