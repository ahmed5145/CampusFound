'use client'

import { Component, type ErrorInfo, type ReactNode } from 'react'

import { captureEvent } from '../lib/analytics'

type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
}

export default class ErrorReporter extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    captureEvent('client_error', {
      message: error.message,
      component_stack: info.componentStack?.slice(0, 500) ?? null
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="mx-auto flex min-h-[50vh] w-full max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Something went wrong</h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Try refreshing the page. If the problem continues, contact campus moderation.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex items-center rounded-full bg-brand-navy px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-navy-hover"
          >
            Refresh page
          </button>
        </main>
      )
    }

    return this.props.children
  }
}
