import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { getApiBaseUrl } from '@/api/client'
import type { HeroSlideItem } from '@/types/api'

function getImageUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const apiBase = getApiBaseUrl()
  return apiBase ? `${apiBase}${url.startsWith('/') ? url : `/${url}`}` : url
}

export interface HeroSlide {
  image: string
  title: string
  subtitle?: string
  description?: string
  primaryButton?: { label: string; to: string }
  secondaryButton?: { label: string; to: string }
}

function mapApiSlideToHero(s: HeroSlideItem): HeroSlide {
  return {
    image: getImageUrl(s.image ?? null),
    title: s.title,
    subtitle: s.subtitle ?? undefined,
    description: s.description ?? undefined,
    primaryButton:
      s.primary_button_label && s.primary_button_url
        ? { label: s.primary_button_label, to: s.primary_button_url }
        : undefined,
    secondaryButton:
      s.secondary_button_label && s.secondary_button_url
        ? { label: s.secondary_button_label, to: s.secondary_button_url }
        : undefined,
  }
}

const AUTOPLAY_MS = 5500

interface HeroSliderProps {
  /** Slides from API (homepage). Only admin-uploaded slides are shown; no default image. */
  apiSlides?: HeroSlideItem[] | null
}

export function HeroSlider({ apiSlides }: HeroSliderProps) {
  const slides = useMemo(() => {
    if (apiSlides && apiSlides.length > 0) {
      return apiSlides.map(mapApiSlideToHero).filter((s) => s.image)
    }
    return []
  }, [apiSlides])

  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set())
  const total = slides.length

  const handleImageError = useCallback((index: number) => {
    setFailedImages((prev) => new Set(prev).add(index))
  }, [])

  useEffect(() => {
    setCurrent(0)
    setFailedImages(new Set())
  }, [slides.length])

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total)
  }, [total])

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total)
  }, [total])

  const goTo = useCallback((index: number) => {
    setCurrent(index)
  }, [])

  const touchStartX = useRef<number | null>(null)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])
  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current == null) return
      const endX = e.changedTouches[0].clientX
      const diff = touchStartX.current - endX
      if (Math.abs(diff) > 50) {
        if (diff > 0) goNext()
        else goPrev()
      }
      touchStartX.current = null
    },
    [goNext, goPrev]
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goPrev, goNext])

  useEffect(() => {
    if (isPaused) return
    const t = setInterval(goNext, AUTOPLAY_MS)
    return () => clearInterval(t)
  }, [current, isPaused, goNext])

  if (total === 0) return null

  const slide = slides[current]

  return (
    <section
      className="relative w-full min-h-[500px] md:min-h-[650px] lg:min-h-[810px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      {slides.map((s, i) => {
        const showGradient = !s.image || failedImages.has(i)
        return (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700 ease-out"
            style={{
              opacity: i === current ? 1 : 0,
              pointerEvents: i === current ? 'auto' : 'none',
            }}
          >
            {showGradient ? (
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-out"
                style={{
                  background: 'linear-gradient(135deg, var(--color-primary) 0%, #1a365d 100%)',
                  transform: i === current ? 'scale(1)' : 'scale(1.05)',
                }}
              />
            ) : (
              <>
                <img
                  src={s.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out"
                  style={{
                    transform: i === current ? 'scale(1)' : 'scale(1.05)',
                  }}
                  onError={() => handleImageError(i)}
                />
              </>
            )}
            <div className="absolute inset-0 bg-black/55" />
          </div>
        )
      })}

      {/* Content - single layer, update by current */}
      <div className="relative z-10 flex items-center justify-center min-h-[500px] md:min-h-[650px] lg:min-h-[810px] py-12 md:py-16 lg:py-20">
        <div
          className="text-center text-white max-w-4xl px-4 md:px-8 transition-opacity duration-500"
          key={current}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 md:mb-4">
            {slide.title}
          </h1>
          {slide.subtitle && (
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-4 md:mb-6 px-4">
              {slide.subtitle}
            </h2>
          )}
          {slide.description && (
            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 md:mb-8 leading-relaxed px-4 line-clamp-3 md:line-clamp-none">
              {slide.description}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
            {slide.primaryButton && (
              <Link to={slide.primaryButton.to} className="w-full sm:w-auto">
                <Button
                  className="text-white px-6 md:px-8 py-4 md:py-6 text-base md:text-lg w-full sm:w-auto hover:opacity-95"
                  style={{ backgroundColor: 'var(--color-gold)' }}
                >
                  {slide.primaryButton.label}
                </Button>
              </Link>
            )}
            {slide.secondaryButton && (
              <Link to={slide.secondaryButton.to} className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="bg-white/10 border-white text-white hover:bg-white/20 px-6 md:px-8 py-4 md:py-6 text-base md:text-lg w-full sm:w-auto"
                >
                  {slide.secondaryButton.label}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Prev / Next */}
      <button
        type="button"
        onClick={goPrev}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        type="button"
        onClick={goNext}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? 28 : 10,
              height: 10,
              backgroundColor: i === current ? 'var(--color-gold)' : 'rgba(255,255,255,0.5)',
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
