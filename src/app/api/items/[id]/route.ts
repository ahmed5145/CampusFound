import { getListingById } from '../../../../lib/db'
import { validateListingIdParam } from '../../../../lib/validators'

type ValidationErrorWithFields = Error & {
  fieldErrors?: Record<string, string[]>
}

function isValidationError(error: unknown): error is ValidationErrorWithFields {
  return (
    error instanceof Error &&
    error.name === 'ValidationError' &&
    typeof (error as ValidationErrorWithFields).fieldErrors === 'object' &&
    (error as ValidationErrorWithFields).fieldErrors !== null
  )
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const validatedId = validateListingIdParam(id)
    const data = await getListingById(validatedId)

    if (!data) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }

    return Response.json({ data }, { status: 200 })
  } catch (error) {
    if (isValidationError(error)) {
      return Response.json(
        {
          error: 'Validation failed',
          fieldErrors: error.fieldErrors ?? {}
        },
        { status: 422 }
      )
    }

    return Response.json({ error: 'Request failed' }, { status: 500 })
  }
}