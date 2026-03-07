import { useEffect, useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { apiClient } from '@/api/client'
import type { NoticeItem } from '@/types/api'
import { Button } from '@/components/ui/button'

export function NoticeDetail() {
  const params = useParams({ strict: false })
  const id = params?.id != null ? Number(params.id) : NaN
  const [notice, setNotice] = useState<NoticeItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!Number.isFinite(id)) {
      setLoading(false)
      return
    }
    apiClient
      .getNotice(id)
      .then((res) => setNotice(res.data))
      .catch(() => setNotice(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="w-full py-12 md:py-16 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-[320px] flex flex-col items-center gap-6">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
        <p style={{ color: '#737887' }}>Loading...</p>
      </div>
    )
  }

  if (!notice) {
    return (
      <div className="w-full py-12 md:py-16 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-[320px] flex flex-col items-center gap-6">
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-dark-lighter)' }}>
          Notice not found
        </h1>
        <Link to="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <article className="w-full">
      <div className="w-full py-8 md:py-12 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-[320px]">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium mb-6 no-underline transition opacity-90 hover:opacity-100"
          style={{ color: 'var(--color-dark-lighter)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1
          className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-6"
          style={{ color: '#141D38' }}
        >
          {notice.title}
        </h1>

        {notice.body && (
          <div
            className="prose prose-lg max-w-none whitespace-pre-wrap"
            style={{ color: '#141D38' }}
          >
            {notice.body}
          </div>
        )}
      </div>
    </article>
  )
}
