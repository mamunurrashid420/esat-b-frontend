import { Link } from '@tanstack/react-router'
import { Megaphone } from 'lucide-react'
import type { NoticeItem } from '@/types/api'

interface NoticeBarProps {
  notices: NoticeItem[]
  loading: boolean
}

export function NoticeBar({ notices, loading }: NoticeBarProps) {
  if (loading || notices.length === 0) {
    return null
  }

  return (
    <div className="sticky z-40 top-[100px] sm:top-[122px] lg:top-[132px] w-full bg-[var(--color-primary)] text-white py-2 md:py-2.5 overflow-hidden border-b border-[var(--color-primary-dark)] relative">
      <div className="flex items-center overflow-hidden">
        <div className="shrink-0 flex items-center gap-2 pl-4 md:pl-6 pr-6 md:pr-8 z-10 bg-[#3B60C9]">
          <Megaphone className="w-4 h-4 md:w-5 md:h-5 shrink-0" aria-hidden />
          <span className="text-xs md:text-sm font-semibold uppercase tracking-wide shrink-0">
            Notice
          </span>
        </div>
        <div className="flex-1 min-w-0 overflow-hidden -ml-2">
          <div className="notice-scroll-wrap flex gap-8">
            {notices.map((notice) => (
              <Link
                key={notice.id}
                to="/notice/$id"
                params={{ id: String(notice.id) }}
                className="shrink-0 inline-flex items-center gap-2 text-sm md:text-base font-medium whitespace-nowrap hover:underline underline-offset-2"
              >
                <span>{notice.title}</span>
                <span className="text-white/80 text-xs">Read more →</span>
              </Link>
            ))}
            {/* Duplicate for seamless loop */}
            {notices.map((notice) => (
              <Link
                key={`dup-${notice.id}`}
                to="/notice/$id"
                params={{ id: String(notice.id) }}
                className="shrink-0 inline-flex items-center gap-2 text-sm md:text-base font-medium whitespace-nowrap hover:underline underline-offset-2"
                aria-hidden
              >
                <span>{notice.title}</span>
                <span className="text-white/80 text-xs">Read more →</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes notice-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .notice-scroll-wrap {
          animation: notice-scroll 40s linear infinite;
        }
        .notice-scroll-wrap:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
