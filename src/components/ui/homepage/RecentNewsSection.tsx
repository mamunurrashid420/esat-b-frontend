import { Link } from '@tanstack/react-router'
import { Calendar, User, ArrowRight } from 'lucide-react'
import type { NewsItem } from '@/types/api'

interface RecentNewsSectionProps {
  news: NewsItem[]
  loading: boolean
}

interface NewsCardProps {
  slug: string
  image: string
  date: string
  title: string
  description: string
  author: string
}

function formatNewsDate(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function NewsCard({ slug, image, date, title, description, author }: NewsCardProps) {
  return (
    <Link
      to="/news-events/$slug"
      params={{ slug }}
      className="flex flex-col rounded-[9.26px] overflow-hidden w-full max-w-[411px] mx-auto no-underline transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      style={{
        background: '#FFFFFF',
        boxShadow: '0px 9.26px 13.89px rgba(8, 14, 28, 0.06)',
      }}
    >
      {/* Image */}
      <div
        className="w-full h-[263px] relative bg-[#E0E0E0]"
        style={{
          ...(image
            ? {
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : {}),
        }}
      />

      {/* Content */}
      <div className="p-4 md:p-6 lg:p-[37px] flex flex-col gap-4 md:gap-6">
        {/* Date */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3 md:w-[11px] md:h-[13px]" style={{ color: '#737887' }} />
            <span 
              className="text-xs md:text-sm lg:text-[13px] leading-5 md:leading-6 lg:leading-[24px]"
              style={{ color: '#737887' }}
            >
              {date}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 
          className="text-lg md:text-xl lg:text-[22px] font-bold leading-6 md:leading-7 lg:leading-[31px]"
          style={{ color: '#141D38' }}
        >
          {title}
        </h3>

        {/* Description */}
        <p 
          className="text-sm md:text-base lg:text-[15px] leading-5 md:leading-6 lg:leading-[26px]"
          style={{ color: '#737887' }}
        >
          {description}
        </p>

        {/* Divider */}
        <div 
          className="w-full h-px"
          style={{ background: '#E0E0E0' }}
        />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span 
              className="text-sm leading-[24px]"
              style={{ color: '#737887' }}
            >
              {author}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <span 
                className="text-sm font-semibold uppercase"
                style={{ color: '#737887' }}
              >
                Read More
              </span>
              <ArrowRight className="w-4 h-4" style={{ color: '#737887' }} />
            </div>
            <div 
              className="w-full h-px"
              style={{ background: '#737887' }}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}

export function RecentNewsSection({ news = [], loading }: RecentNewsSectionProps) {
  const cardItems = (news ?? []).slice(0, 3).map((item) => ({
    slug: item.slug,
    image: item.image ?? '',
    date: formatNewsDate(item.published_at ?? item.created_at),
    title: item.title,
    description: item.description ?? '',
    author: item.author ?? 'By Author',
  }))

  return (
    <section className="w-full py-12 md:py-16 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-[320px] flex flex-col items-center gap-6 md:gap-8">
      <h2
        className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight md:leading-[56px] lg:leading-[72px] text-center"
        style={{ color: 'var(--color-dark-lighter)' }}
      >
        News & Events
      </h2>

      {loading ? (
        <p className="text-center" style={{ color: '#737887' }}>
          Loading...
        </p>
      ) : cardItems.length === 0 ? (
        <p className="text-center" style={{ color: '#737887' }}>
          No news at the moment.
        </p>
      ) : (
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full justify-center">
          {cardItems.map((item, index) => (
            <NewsCard key={news[index]?.id ?? index} {...item} />
          ))}
        </div>
      )}
    </section>
  )
}
