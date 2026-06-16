import 'server-only'

import { getServiceSupabase } from './supabaseClient'

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET
const STORAGE_MODE = process.env.SUPABASE_STORAGE_MODE ?? 'public'
const SIGNED_URL_TTL_SECONDS = Number.parseInt(process.env.SUPABASE_STORAGE_SIGNED_URL_TTL_SECONDS ?? '3600', 10)

if (!BUCKET) {
  throw new Error('SUPABASE_STORAGE_BUCKET environment variable is not set')
}

if (STORAGE_MODE !== 'public' && STORAGE_MODE !== 'signed') {
  throw new Error('SUPABASE_STORAGE_MODE must be either public or signed')
}

function getBucket(): string {
  return BUCKET as string
}

export function buildListingImagePath(listingId: string): string {
  return `${listingId.trim()}/image.jpg`
}

type UploadResult = {
  path: string
  publicUrl?: string
}

export async function uploadListingImage(listingId: string, file: Blob | Buffer | Uint8Array | ArrayBuffer): Promise<UploadResult> {
  const supabase = getServiceSupabase()
  const bucket = getBucket()

  const uploadPath = buildListingImagePath(listingId)
  const uploadBody = file instanceof Blob
    ? file
    : file instanceof ArrayBuffer
      ? Buffer.from(file)
      : Buffer.from(file.buffer, file.byteOffset, file.byteLength)
  const uploadOptions = file instanceof Blob && file.type
    ? { upsert: true, contentType: file.type }
    : { upsert: true }

  const { error: uploadError } = await supabase.storage.from(bucket).upload(uploadPath, uploadBody, uploadOptions)
  if (uploadError) {
    throw uploadError
  }

  if (STORAGE_MODE === 'public') {
    const { data } = supabase.storage.from(bucket).getPublicUrl(uploadPath)
    if (!data || !data.publicUrl) {
      throw new Error('Failed to obtain public URL from storage')
    }

    return { path: uploadPath, publicUrl: data.publicUrl }
  }

  return { path: uploadPath }
}

export async function deleteListingImage(listingId: string): Promise<{ path: string, removed: boolean }> {
  const supabase = getServiceSupabase()
  const bucket = getBucket()
  const path = buildListingImagePath(listingId)

  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) {
    // If error is 'The resource was not found' supabase may return an error; propagate as false removal
    return { path, removed: false }
  }

  return { path, removed: true }
}

function looksLikeAbsoluteUrl(value: string): boolean {
  return value.startsWith('http://') || value.startsWith('https://')
}

export async function getListingImageDisplayUrl(input: {
  imageUrl: string | null
  imagePath: string | null
}): Promise<string | null> {
  const url = input.imageUrl?.trim() ? input.imageUrl.trim() : null
  const path = input.imagePath?.trim() ? input.imagePath.trim() : null

  // If it already looks like a real URL, keep it.
  if (url && looksLikeAbsoluteUrl(url)) {
    return url
  }

  // Signed mode: derive from storage path (preferred) or from the url field if it contains a path.
  if (STORAGE_MODE === 'signed') {
    const supabase = getServiceSupabase()
    const bucket = getBucket()
    const objectPath = path ?? url
    if (!objectPath) return null

    const ttl = Number.isFinite(SIGNED_URL_TTL_SECONDS) && SIGNED_URL_TTL_SECONDS > 0 ? SIGNED_URL_TTL_SECONDS : 3600
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(objectPath, ttl)
    if (error) {
      throw error
    }
    return data?.signedUrl ?? null
  }

  // Public mode: if url is a path, try to convert it to a public URL.
  if (url) {
    const supabase = getServiceSupabase()
    const bucket = getBucket()
    const { data } = supabase.storage.from(bucket).getPublicUrl(url)
    return data?.publicUrl ?? null
  }

  return null
}
