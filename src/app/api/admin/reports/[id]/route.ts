import { updateReportStatus } from '../../../../../lib/reports'
import type { ReportStatus } from '../../../../../types/db-schema'
import { validateReportIdParam } from '../../../../../lib/validators'

type ReportStatusBody = {
  status?: string
}

const ALLOWED_STATUSES = new Set<ReportStatus>(['open', 'resolved', 'dismissed'])

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const validatedId = validateReportIdParam(id)
    const body = (await request.json().catch(() => null)) as ReportStatusBody | null
    const status = body?.status

    if (!status || !ALLOWED_STATUSES.has(status as ReportStatus)) {
      return Response.json({ error: 'Validation failed' }, { status: 422 })
    }

    const updated = await updateReportStatus(validatedId, status as ReportStatus)
    if (!updated) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }

    return Response.json({ data: updated }, { status: 200 })
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      return Response.json({ error: 'Validation failed' }, { status: 422 })
    }

    return Response.json({ error: 'Request failed' }, { status: 500 })
  }
}
