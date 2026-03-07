import { useEffect, useState } from 'react'
import { getApiBaseUrl } from '@/api/client'

const SHORT_TEXT_LENGTH = 280

export interface AboutUsSectionProps {
  /** Main image URL (from API). When set, overrides random static image. */
  mainImageUrl?: string | null;
  /** Overlapping image URL (from API). When set, overrides random static image. */
  overlappingImageUrl?: string | null;
}

const fullText = `The Ex-Students Association Of Textile Engineering College, Barishal (ESAT-B) serves as the heart of our alumni community, connecting former students from different batches and backgrounds. The association is established with the vision of building strong bridges among the alumni, actively contributing to the welfare and overall development of both the college and its alumni through cooperation and collective initiatives.

Textile Engineering College, Barishal has shaped future leaders, professionals, and change-makers. We take immense pride in celebrating the achievements and contributions of our alumni across various fields. ESAT-B aims to strengthen this proud legacy by organizing meaningful events, creating networking opportunities, and supporting initiatives that benefit both alumni and current students.

Through reunions, mentorship programs, educational support, and community outreach activities, the association strives to ensure that every member feels connected, valued, and empowered to make a positive difference. ESAT-B provides a platform where lifelong bonds are nurtured, knowledge is shared and collaboration is encouraged for mutual growth.

Through this platform, alumni will maintain and nurture the bond among themselves and contribute to the overall development of the college & ex-students. ESAT-B also deeply respects the contribution of the great persons who established & developed the college. Let's keep the spirit of Textile Engineering College, Barishal alive and soar together toward new horizons.`

/** Build full image URL – uses same API base as homepage fetch so images load. */
function getImageUrl(url: string | null | undefined): string | undefined {
  if (!url || typeof url !== 'string') return undefined
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const apiBase = getApiBaseUrl()
  return apiBase ? `${apiBase}${url.startsWith('/') ? url : `/${url}`}` : url
}

export function AboutUsSection({ mainImageUrl, overlappingImageUrl }: AboutUsSectionProps = {}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [mainError, setMainError] = useState(false)
  const [overlapError, setOverlapError] = useState(false)

  const dynamicMainUrl = getImageUrl(mainImageUrl)
  const dynamicOverlapUrl = getImageUrl(overlappingImageUrl)

  useEffect(() => {
    setMainError(false)
    setOverlapError(false)
  }, [mainImageUrl, overlappingImageUrl])

  const showMainImage = Boolean(dynamicMainUrl && !mainError)
  const showOverlapImage = Boolean(dynamicOverlapUrl && !overlapError)

  return (
    <section 
      className="w-full py-12 md:py-16 lg:py-20 relative z-10"
    >
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-[320px]">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 md:gap-12 lg:gap-24">
        {/* Left Side - Image Collage */}
        <div className="relative w-full lg:w-[494px] h-[400px] md:h-[450px] lg:h-[520px] shrink-0 max-w-[494px] mx-auto lg:mx-0">
          {/* Background SVG Shape */}
          <div 
            className="absolute left-0 top-0 w-[114px] md:w-[180px] lg:w-[228px] h-[90px] md:h-[140px] lg:h-[179px]"
            style={{ 
              background: 'var(--color-primary)',
              clipPath: 'polygon(0 0, 0 100%, 100% 0)'
            }}
          />
          
          {/* Main image – only from API; no default on reload */}
          {showMainImage ? (
            <img 
              src={dynamicMainUrl}
              alt="ESAT-B About Us"
              className="absolute left-[18px] md:left-[28px] lg:left-[35px] top-[18px] md:top-[28px] lg:top-[35px] w-[calc(100%-36px)] md:w-[calc(100%-56px)] lg:w-[403px] h-[calc(100%-36px)] md:h-[calc(100%-56px)] lg:h-[433px] rounded object-cover"
              onError={() => setMainError(true)}
            />
          ) : (
            <div 
              className="absolute left-[18px] md:left-[28px] lg:left-[35px] top-[18px] md:top-[28px] lg:top-[35px] w-[calc(100%-36px)] md:w-[calc(100%-56px)] lg:w-[403px] h-[calc(100%-36px)] md:h-[calc(100%-56px)] lg:h-[433px] rounded bg-muted"
              aria-hidden
            />
          )}
          
          {/* Overlapping image – only from API; no default on reload */}
          {showOverlapImage ? (
            <img 
              src={dynamicOverlapUrl}
              alt="ESAT-B Community"
              className="absolute right-0 bottom-0 w-[40%] md:w-[45%] lg:w-[227px] h-[60%] md:h-[65%] lg:h-[312px] rounded shadow-lg object-cover"
              style={{ boxShadow: '0px 0px 94.47px rgba(0, 0, 0, 0.24)' }}
              onError={() => setOverlapError(true)}
            />
          ) : (
            <div 
              className="absolute right-0 bottom-0 w-[40%] md:w-[45%] lg:w-[227px] h-[60%] md:h-[65%] lg:h-[312px] rounded bg-muted"
              aria-hidden
            />
          )}
        </div>

        {/* Right Side - Content */}
        <div className="flex-1 max-w-[686px] w-full">
          <div className="flex flex-col gap-6 md:gap-8 lg:gap-11">
            <div className="flex flex-col gap-2">
              <p 
                className="text-sm md:text-base font-semibold"
                style={{ color: '#999898' }}
              >
                About Us
              </p>
              <h2 
                className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight md:leading-[56px] lg:leading-[72px]"
                style={{ color: 'var(--color-dark-lighter)' }}
              >
                Ex-Students Association Of Textile Engineering College, Barishal (ESAT-B)
              </h2>
            </div>

            <div className="flex flex-col gap-4 md:gap-6">
              <p 
                className="text-sm md:text-base leading-relaxed md:leading-[26px] whitespace-pre-line"
                style={{ color: '#696868' }}
              >
                {isExpanded
                  ? fullText
                  : `${fullText.slice(0, SHORT_TEXT_LENGTH).trim()}${fullText.length > SHORT_TEXT_LENGTH ? '...' : ''}`}
              </p>
              {fullText.length > SHORT_TEXT_LENGTH && (
                <button
                  type="button"
                  onClick={() => setIsExpanded((prev) => !prev)}
                  className="text-sm font-semibold text-left w-fit hover:underline focus:outline-none focus:underline"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {isExpanded ? 'See less' : 'See more'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}
