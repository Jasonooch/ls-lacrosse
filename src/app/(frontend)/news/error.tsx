'use client'

import { useEffect } from 'react'
import PageTitle from '@/components/ui/PageTitle/PageTitle'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('News page error:', error)
  }, [error])

  return (
    <section className='pt-[var(--item-gap)] pb-[var(--section-padding)]'>
      <div className="container">
        <div className="flex flex-col gap-[2rem] items-center justify-center min-h-[50vh]">
          <PageTitle>Something went wrong</PageTitle>
          <div className="text-center max-w-md">
            <p className="text-lg mb-4">
              We encountered an error while loading the news. Please try again.
            </p>
            <button
              onClick={reset}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
