import 'server-only'

import { getServiceSupabase } from './supabaseClient'

function getStorageMode(): 'public' | 'signed' {
  const mode = (process.env.SUPABASE_STORAGE_MODE ?? 'public').trim()
  if (mode === 'public' || mode === 'signed') {
    return mode
  }
  throw new Error('SUPABASE_STORAGE_MODE must be either public or signed')
}

function getSignedUrlTtlSeconds(): number {
  const raw = process.env.SUPABASE_STORAGE_SIGNED_URL_TTL_SECONDS ?? '3600'
  const parsed = Number.parseInt(raw, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 3600
}

function getBucket(): string {
  // Default to `listings` so builds/CI don't fail due to missing env.
  // Production should still set this explicitly.
  return (process.env.SUPABASE_STORAGE_BUCKET ?? 'listings').trim()
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
  const storageMode = getStorageMode()

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

  if (storageMode === 'public') {
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
  const storageMode = getStorageMode()

  // If it already looks like a real URL, keep it.
  if (url && looksLikeAbsoluteUrl(url)) {
    return url
  }

  // Signed mode: derive from storage path (preferred) or from the url field if it contains a path.
  if (storageMode === 'signed') {
    const supabase = getServiceSupabase()
    const bucket = getBucket()
    const objectPath = path ?? url
    if (!objectPath) return null

    const ttl = getSignedUrlTtlSeconds()
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

export function getListingImageThumbnailUrl(imageUrl: string | null, width = 320): string | null {
  if (!imageUrl) {
    return null
  }

  const transformsEnabled = process.env.SUPABASE_IMAGE_TRANSFORMS === 'true'
  if (!transformsEnabled) {
    return imageUrl
  }

  const objectPublicMatch = imageUrl.match(/^(https?:\/\/[^/]+)\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/)
  if (!objectPublicMatch) {
    return imageUrl
  }

  const [, origin, bucket, objectPath] = objectPublicMatch
  const params = new URLSearchParams({
    width: String(width),
    height: String(width),
    resize: 'cover'
  })

  return `${origin}/storage/v1/render/image/public/${bucket}/${objectPath}?${params.toString()}`
}
