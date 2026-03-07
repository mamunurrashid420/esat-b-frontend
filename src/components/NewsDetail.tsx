import { useEffect, useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import { apiClient } from '@/api/client'
import type { NewsItem } from '@/types/api'
import { Button } from '@/components/ui/button'

function formatNewsDate(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function NewsDetail() {
  const params = useParams({ strict: false })
  const slug = params?.slug as string | undefined
  const [news, setNews] = useState<NewsItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }
    apiClient
      .getNewsBySlug(slug)
      .then((res) => setNews(res.data))
      .catch(() => setNews(null))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="w-full py-12 md:py-16 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-[320px] flex flex-col items-center gap-6">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
        <p style={{ color: '#737887' }}>Loading...</p>
      </div>
    )
  }

  if (!news) {
    return (
      <div className="w-full py-12 md:py-16 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-[320px] flex flex-col items-center gap-6">
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-dark-lighter)' }}>
          News not found
        </h1>
        <Link to="/news-events">
          <Button variant="outline">Back to News & Events</Button>
        </Link>
      </div>
    )
  }

  return (
    <article className="w-full">
      {/* Banner image — 30% width */}
      {news.image && (
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-[320px] pt-8">
          <div
            className="w-[30%] aspect-video min-h-[140px] bg-[#E0E0E0] rounded-lg overflow-hidden"
            style={{
              backgroundImage: `url(${news.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>
      )}

      {/* Content below banner — left-aligned, same horizontal padding as site */}
      <div className="w-full py-8 md:py-12 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-[320px]">
        <Link
          to="/news-events"
          className="inline-flex items-center gap-2 text-sm font-medium mb-6 no-underline transition opacity-90 hover:opacity-100"
          style={{ color: 'var(--color-dark-lighter)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to News & Events
        </Link>

        <div className="flex flex-wrap items-center gap-4 mb-4" style={{ color: '#737887' }}>
          <span className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4" />
            {formatNewsDate(news.published_at ?? news.created_at)}
          </span>
          {news.author && (
            <span className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4" />
              {news.author}
            </span>
          )}
        </div>

        <h1
          className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-4"
          style={{ color: '#141D38' }}
        >
          {news.title}
        </h1>

        {news.description && (
          <p
            className="text-base md:text-lg leading-relaxed mb-6"
            style={{ color: '#737887' }}
          >
            {news.description}
          </p>
        )}

        {news.body && (
          <div
            className="prose prose-lg max-w-none whitespace-pre-wrap"
            style={{ color: '#141D38' }}
          >
            {news.body}
          </div>
        )}
      </div>
    </article>
  )
}
