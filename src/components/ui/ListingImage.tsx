'use client'

import { useState, type ImgHTMLAttributes } from 'react'

type ListingImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  imageUrl: string
  thumbnailUrl?: string
}

export default function ListingImage({ imageUrl, thumbnailUrl, alt, onError, ...props }: ListingImageProps) {
  const preferredSrc = thumbnailUrl || imageUrl
  const [src, setSrc] = useState(preferredSrc)

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      src={src}
      alt={alt}
      onError={(event) => {
        if (src !== imageUrl) {
          setSrc(imageUrl)
          return
        }

        onError?.(event)
      }}
    />
  )
}
