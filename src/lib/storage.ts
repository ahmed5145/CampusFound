import 'server-only'

import { getServiceSupabase } from './supabaseClient'

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET

if (!BUCKET) {
  throw new Error('SUPABASE_STORAGE_BUCKET environment variable is not set')
}

function getBucket(): string {
  return BUCKET as string
}

export function buildListingImagePath(listingId: string): string {
  return `listings/${listingId.trim()}/image.jpg`
}

type UploadResult = {
  path: string
  publicUrl: string
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

  const { data } = supabase.storage.from(bucket).getPublicUrl(uploadPath)
  if (!data || !data.publicUrl) {
    throw new Error('Failed to obtain public URL from storage')
  }

  return { path: uploadPath, publicUrl: data.publicUrl }
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
