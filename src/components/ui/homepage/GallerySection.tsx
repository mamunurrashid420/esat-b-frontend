import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { GalleryPhoto } from '@/types/api'

const DISPLAY_LIMIT = 8

interface GallerySectionProps {
  photos: GalleryPhoto[]
  loading: boolean
}

export function GallerySection({ photos, loading }: GallerySectionProps) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(0)
  const [previewPhoto, setPreviewPhoto] = useState<GalleryPhoto | null>(null)

  const categories = useMemo(() => {
    const set = new Set(photos.map((p) => p.category).filter(Boolean))
    return ['All', ...Array.from(set).sort()]
  }, [photos])

  const filteredImages =
    activeFilter === 'All' ? photos : photos.filter((img) => img.category === activeFilter)
  const totalPages = Math.max(1, Math.ceil(filteredImages.length / DISPLAY_LIMIT))
  const displayedPhotos = filteredImages.slice(
    currentPage * DISPLAY_LIMIT,
    (currentPage + 1) * DISPLAY_LIMIT
  )

  useEffect(() => {
    setCurrentPage(0)
  }, [activeFilter])

  const goPrev = useCallback(
    () => setCurrentPage((p) => Math.max(0, p - 1)),
    []
  )
  const goNext = useCallback(
    () => setCurrentPage((p) => Math.min(totalPages - 1, p + 1)),
    [totalPages]
  )

  const touchStartX = useRef<number | null>(null)
  const SWIPE_THRESHOLD = 50
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])
  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current == null) return
      const endX = e.changedTouches[0].clientX
      const delta = touchStartX.current - endX
      touchStartX.current = null
      if (delta > SWIPE_THRESHOLD) goNext()
      else if (delta < -SWIPE_THRESHOLD) goPrev()
    },
    [goNext, goPrev]
  )

  const closePreview = useCallback(() => setPreviewPhoto(null), [])
  useEffect(() => {
    if (!previewPhoto) return
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && closePreview()
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [previewPhoto, closePreview])

  if (loading) {
    return (
      <section className="w-full py-12 md:py-16 flex flex-col items-center gap-6 md:gap-8 lg:gap-9">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-[336px] box-border">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight md:leading-[56px] lg:leading-[72px] text-center"
            style={{ color: 'var(--color-dark-lighter)' }}
          >
            Gallery
          </h2>
          <p className="text-center mt-6" style={{ color: '#696868' }}>
            Loading...
          </p>
        </div>
      </section>
    )
  }

  if (photos.length === 0) {
    return (
      <section className="w-full py-12 md:py-16 flex flex-col items-center gap-6 md:gap-8 lg:gap-9">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-[336px] box-border">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight md:leading-[56px] lg:leading-[72px] text-center"
            style={{ color: 'var(--color-dark-lighter)' }}
          >
            Gallery
          </h2>
          <p className="text-center mt-6" style={{ color: '#696868' }}>
            No photos yet.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full py-12 md:py-16 flex flex-col items-center gap-6 md:gap-8 lg:gap-9">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-[336px] box-border">
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight md:leading-[56px] lg:leading-[72px] text-center"
          style={{ color: 'var(--color-dark-lighter)' }}
        >
          Gallery
        </h2>

        {/* Filter Tabs */}
        <div
          className="flex flex-wrap items-center justify-center gap-3 md:gap-6 px-1.5 py-2 rounded-xl mt-6 md:mt-8"
          style={{ background: '#F9F9F9' }}
        >
          {categories.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className="px-3 md:px-5 py-2 rounded-md text-sm md:text-base font-medium transition-colors"
              style={{
                background: activeFilter === filter ? 'var(--color-primary)' : 'transparent',
                color: activeFilter === filter ? '#FFFFFF' : 'var(--color-primary)',
                boxShadow: activeFilter === filter ? '0px 0px 16px rgba(42, 42, 42, 0.25)' : 'none',
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Image Grid - first 8 photos in 2 rows (4 per row), swipeable */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 w-full mt-6 md:mt-8"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {displayedPhotos.map((img) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setPreviewPhoto(img)}
              className="aspect-4/3 w-full overflow-hidden rounded-2xl bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-custom focus:ring-offset-2"
            >
              <img
                src={img.url ?? ''}
                alt={img.category ? `Gallery - ${img.category}` : 'Gallery'}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>

        {/* Preview lightbox */}
        {previewPhoto?.url && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Image preview"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 p-4 gap-4"
            onClick={closePreview}
          >
            <button
              type="button"
              className="absolute top-4 right-4 z-10 rounded-full bg-white/90 p-2 text-neutral-800 hover:bg-white"
              onClick={closePreview}
              aria-label="Close preview"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={previewPhoto.url}
              alt={previewPhoto.category ? `Gallery - ${previewPhoto.category}` : 'Gallery'}
              className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            {previewPhoto.category && (
              <p
                className="text-center text-sm font-medium text-white drop-shadow-md"
                onClick={(e) => e.stopPropagation()}
              >
                {previewPhoto.category}
              </p>
            )}
          </div>
        )}

        {/* Prev / Next + Pagination Dots */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 md:gap-6 mt-6 md:mt-8">
            <button
              type="button"
              onClick={goPrev}
              disabled={currentPage === 0}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ borderColor: '#525FE1', color: '#525FE1' }}
              aria-label="Previous page"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentPage(i)}
                  className="w-[10px] h-[10px] rounded-full transition-colors"
                  style={{
                    background: i === currentPage ? '#525FE1' : 'rgba(82, 95, 225, 0.5)',
                  }}
                  aria-label={`Page ${i + 1} of ${totalPages}`}
                  aria-current={i === currentPage ? 'true' : undefined}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={goNext}
              disabled={currentPage >= totalPages - 1}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ borderColor: '#525FE1', color: '#525FE1' }}
              aria-label="Next page"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
