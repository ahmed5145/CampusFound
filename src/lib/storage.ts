import 'server-only'

import { getServiceSupabase } from './supabaseClient'

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET

if (!BUCKET) {
  throw new Error('SUPABASE_STORAGE_BUCKET environment variable is not set')
}

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp'
}

function ensureLeadingSlash(path: string): string {
  return path.startsWith('/') ? path.slice(1) : path
}

export function buildListingImagePath(listingId: string, filename?: string, mimeType?: string): string {
  const sanitizedId = listingId.trim()

  // Derive extension from filename or mime type; fall back to .jpg
  let ext = '.jpg'
  if (filename) {
    const match = filename.match(/\.([a-zA-Z0-9]+)$/)
    if (match) ext = `.${match[1].toLowerCase()}`
  }
  if (!filename && mimeType && MIME_TO_EXT[mimeType]) {
    ext = MIME_TO_EXT[mimeType]
  }

  // Deterministic single-image path per listing id
  return ensureLeadingSlash(`listings/${sanitizedId}/image${ext}`)
}

type UploadResult = {
  path: string
  publicUrl: string
}

export async function uploadListingImage(listingId: string, file: Blob | Buffer | Uint8Array | ArrayBuffer, opts?: { filename?: string, contentType?: string }): Promise<UploadResult> {
  const supabase = getServiceSupabase()

  const mime = opts?.contentType || (file instanceof Blob ? file.type : '')
  const path = buildListingImagePath(listingId, opts?.filename, mime)

  // Supabase storage upload expects path without leading slash
  const uploadPath = path.startsWith('/') ? path.slice(1) : path

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(uploadPath, file as any, { upsert: true })
  if (uploadError) {
    throw uploadError
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(uploadPath)
  if (!data || !data.publicUrl) {
    throw new Error('Failed to obtain public URL from storage')
  }

  return { path: uploadPath, publicUrl: data.publicUrl }
}

export async function deleteListingImage(listingId: string): Promise<{ path: string, removed: boolean }> {
  const supabase = getServiceSupabase()
  const pathPrefix = buildListingImagePath(listingId)
  const path = pathPrefix.startsWith('/') ? pathPrefix.slice(1) : pathPrefix

  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) {
    // If error is 'The resource was not found' supabase may return an error; propagate as false removal
    return { path, removed: false }
  }

  return { path, removed: true }
}

export default {
  buildListingImagePath,
  uploadListingImage,
  deleteListingImage
}
