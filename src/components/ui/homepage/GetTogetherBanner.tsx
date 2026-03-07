import { useState, useEffect } from 'react'
import { GetTogetherSection } from './GetTogetherSection'
import type { Event } from '@/types/api'

interface GetTogetherBannerProps {
  events: Event[]
  loading: boolean
}

export function GetTogetherBanner({ events, loading }: GetTogetherBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (events.length > 0 && currentIndex >= events.length) {
      setCurrentIndex(0)
    }
  }, [events.length, currentIndex])

  const currentEvent = events[currentIndex]
  const coverPhoto = currentEvent?.cover_photo ?? null
  const imageAlt = currentEvent?.title || 'Alumni gathering'

  const goPrev = () => {
    setCurrentIndex((i) => (i <= 0 ? events.length - 1 : i - 1))
  }
  const goNext = () => {
    setCurrentIndex((i) => (i >= events.length - 1 ? 0 : i + 1))
  }

  if (loading || events.length === 0) {
    return null
  }

  return (
    <section 
      className="relative z-20 w-full max-w-[1280px] mx-auto mt-0 sm:-mt-16 md:-mt-[140px] lg:-mt-[190px] px-4 md:px-6 lg:px-8"
      style={{
        background: 'var(--color-primary)',
        boxShadow: '0px 0px 20px rgba(29, 29, 29, 0.25)',
        borderRadius: '4px',
      }}
    >
      <div className="flex flex-col md:flex-row min-h-0 md:min-h-[280px] lg:min-h-[300px] md:max-h-[420px]">
        {/* Left Side - Event Cover Photo */}
        <div className="w-full md:w-[35%] h-[140px] sm:h-[160px] md:h-full md:max-h-[420px] overflow-hidden rounded-t-[4px] md:rounded-l-[4px] md:rounded-t-none shrink-0">
          {coverPhoto ? (
            <img 
              src={coverPhoto}
              alt={imageAlt}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{ background: 'linear-gradient(135deg, #1a365d 0%, var(--color-primary) 100%)' }}
              aria-hidden
            />
          )}
        </div>
        
        {/* Right Side - Content */}
        <div className="w-full md:w-[60%] min-h-0 md:h-full flex flex-col">
          <GetTogetherSection 
            events={events}
            loading={loading}
            currentIndex={currentIndex}
            onPrev={goPrev}
            onNext={goNext}
          />
        </div>
      </div>
    </section>
  )
}
