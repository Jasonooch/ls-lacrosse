'use client'

import { useEffect } from 'react'
import PageTitle from '@/components/ui/PageTitle/PageTitle'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('News article error:', error)
  }, [error])

  return (
    <section className='pt-[var(--item-gap)] pb-[var(--section-padding)]'>
      <div className="container">
        <div className="flex flex-col gap-[2rem] items-center justify-center min-h-[50vh]">
          <PageTitle>Article Not Available</PageTitle>
          <div className="text-center max-w-md">
            <p className="text-lg mb-4">
              We encountered an error while loading this article. The article may have been removed or there may be a temporary issue.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={reset}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try again
              </button>
              <Link
                href="/news"
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back to News
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
