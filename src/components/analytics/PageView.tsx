'use client'

import { useEffect } from 'react'

import { captureEvent } from '../../lib/analytics'

type PageViewProps = {
  eventName: string
  properties?: Record<string, unknown>
}

export default function PageView({ eventName, properties }: PageViewProps) {
  useEffect(() => {
    captureEvent(eventName, properties)
    // Only on mount for the given eventName/properties values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

