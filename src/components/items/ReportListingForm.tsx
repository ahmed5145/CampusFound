'use client'

import { useEffect, useState } from 'react'

import { REPORT_REASONS, REPORT_REASON_LABELS } from '../../config/constants'
import type { ReportReason } from '../../types/db-schema'

type ReportListingFormProps = {
  listingId: string
}

function reportStorageKey(listingId: string): string {
  return `campusfound:reported:${listingId}`
}

function markListingReported(listingId: string): void {
  try {
    globalThis.localStorage.setItem(reportStorageKey(listingId), '1')
  } catch {
    // Ignore storage failures in private browsing or restricted environments.
  }
}

function hasLocalReportFlag(listingId: string): boolean {
  try {
    return globalThis.localStorage.getItem(reportStorageKey(listingId)) === '1'
  } catch {
    return false
  }
}

export default function ReportListingForm({ listingId }: ReportListingFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [reason, setReason] = useState<ReportReason | ''>('')
  const [details, setDetails] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCheckingStatus, setIsCheckingStatus] = useState(true)
  const [alreadyReported, setAlreadyReported] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    async function checkReportStatus() {
      if (hasLocalReportFlag(listingId)) {
        if (isActive) {
          setAlreadyReported(true)
          setIsCheckingStatus(false)
        }
        return
      }

      try {
        const response = await fetch(`/api/items/${listingId}/report`)
        if (!response.ok) {
          return
        }

        const payload = (await response.json()) as { data?: { alreadyReported?: boolean } }
        if (!isActive) {
          return
        }

        const reported = Boolean(payload.data?.alreadyReported)
        setAlreadyReported(reported)
        if (reported) {
          markListingReported(listingId)
        }
      } catch {
        // Keep the form available if the status check fails.
      } finally {
        if (isActive) {
          setIsCheckingStatus(false)
        }
      }
    }

    void checkReportStatus()

    return () => {
      isActive = false
    }
  }, [listingId])

  function resetForm() {
    setReason('')
    setDetails('')
    setErrorMessage(null)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitting || !reason || alreadyReported) {
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await fetch(`/api/items/${listingId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason,
          details: details.trim().length > 0 ? details.trim() : null
        })
      })

      if (response.status === 201) {
        markListingReported(listingId)
        setAlreadyReported(true)
        setSuccessMessage('Thank you. Your report was submitted for review.')
        resetForm()
        setIsOpen(false)
        return
      }

      if (response.status === 409) {
        markListingReported(listingId)
        setAlreadyReported(true)
        setIsOpen(false)
        setSuccessMessage('You have already reported this listing.')
        return
      }

      if (response.status === 422) {
        const payload = (await response.json().catch(() => null)) as {
          fieldErrors?: Record<string, string[]>
        } | null
        const firstError = payload?.fieldErrors
          ? Object.values(payload.fieldErrors).flat()[0]
          : null
        setErrorMessage(firstError ?? 'Please check the form and try again.')
        return
      }

      if (response.status === 429) {
        setErrorMessage('Too many reports submitted. Please wait a moment and try again.')
        return
      }

      setErrorMessage('Could not submit your report. Please try again.')
    } catch {
      setErrorMessage('Could not submit your report. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isCheckingStatus) {
    return (
      <section className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm text-gray-600">Checking report status…</p>
      </section>
    )
  }

  if (alreadyReported) {
    return (
      <section className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm font-medium text-gray-900">Report submitted</p>
        <p className="mt-1 text-sm text-gray-600">
          {successMessage ?? 'You have already reported this listing. Moderators will review it if needed.'}
        </p>
      </section>
    )
  }

  return (
    <section className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">See something inappropriate?</p>
          <p className="mt-1 text-sm text-gray-600">
            Report listings that contain personal information, unsafe content, or spam.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsOpen((current) => !current)
            setSuccessMessage(null)
            setErrorMessage(null)
          }}
          className="inline-flex h-10 items-center justify-center rounded-full border border-gray-300 bg-white px-4 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
        >
          {isOpen ? 'Cancel report' : 'Report listing'}
        </button>
      </div>

      {isOpen ? (
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-gray-700">Reason</span>
            <select
              value={reason}
              onChange={(event) => setReason(event.target.value as ReportReason | '')}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
              required
            >
              <option value="">Select a reason</option>
              {REPORT_REASONS.map((value) => (
                <option key={value} value={value}>
                  {REPORT_REASON_LABELS[value]}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-gray-700">
              Additional details {reason === 'other' ? '(required)' : '(optional)'}
            </span>
            <textarea
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Share any context that helps moderators review this listing."
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
            />
          </label>

          {errorMessage ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting || !reason}
            className="inline-flex h-10 items-center justify-center rounded-full bg-gray-900 px-4 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50"
          >
            {isSubmitting ? 'Submitting…' : 'Submit report'}
          </button>
        </form>
      ) : null}
    </section>
  )
}
