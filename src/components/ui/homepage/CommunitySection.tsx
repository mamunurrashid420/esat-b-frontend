import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getApiBaseUrl } from '@/api/client'

function getImageUrl(url: string | null | undefined): string | undefined {
  if (!url || typeof url !== 'string') return undefined
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const apiBase = getApiBaseUrl()
  return apiBase ? `${apiBase}${url.startsWith('/') ? url : `/${url}`}` : url
}

export interface CommunitySectionProps {
  /** Image URL (from API) for the arched image. */
  imageUrl?: string | null
}

export function CommunitySection({ imageUrl }: CommunitySectionProps = {}) {
  const [imgError, setImgError] = useState(false)
  const dynamicUrl = getImageUrl(imageUrl)

  useEffect(() => {
    const t = setTimeout(() => setImgError(false), 0)
    return () => clearTimeout(t)
  }, [imageUrl])

  const showImage = Boolean(dynamicUrl && !imgError)

  return (
    <section 
      className="w-full py-12 md:py-16 lg:py-20 relative"
    >
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-[368px] box-border">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 md:gap-12 lg:gap-[90px]">
        {/* Left Side - Image */}
        <div className="relative w-full lg:w-[503px] h-[400px] md:h-[500px] lg:h-[587px] flex-shrink-0 max-w-[503px] mx-auto lg:mx-0">
          {/* SVG Border Shape - positioned at origin, extends beyond image */}
          <svg 
            className="absolute left-0 top-0 w-[232px] md:w-[350px] lg:w-[464px] h-[270px] md:h-[400px] lg:h-[540px]"
            viewBox="0 0 464 540" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ zIndex: 0 }}
          >
            <path 
              d="M231.972 2.5C358.705 2.50016 461.442 105.238 461.442 231.972V534.572C461.442 535.953 460.323 537.072 458.942 537.072H5C3.61946 537.072 2.50026 535.953 2.5 534.572V231.971C2.50021 105.237 105.238 2.5 231.972 2.5Z" 
              stroke="#F86F03" 
              strokeWidth="5"
            />
          </svg>
          {showImage ? (
            <img 
              src={dynamicUrl}
              alt="Creating A Community Of Life Long Learners"
              className="absolute left-0 lg:left-[-20px] top-[-30px] w-[calc(100%-40px)] md:w-[calc(100%-60px)] lg:w-[478px] h-[calc(100%-40px)] md:h-[calc(100%-60px)] lg:h-[567px] rounded-t-[132px] md:rounded-t-[200px] lg:rounded-t-[265px] object-cover"
              style={{ zIndex: 1 }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div 
              className="absolute left-0 lg:left-[-20px] top-[-30px] w-[calc(100%-40px)] md:w-[calc(100%-60px)] lg:w-[478px] h-[calc(100%-40px)] md:h-[calc(100%-60px)] lg:h-[567px] rounded-t-[132px] md:rounded-t-[200px] lg:rounded-t-[265px] bg-muted"
              style={{ zIndex: 1 }}
              aria-hidden
            />
          )}
        </div>

        {/* Right Side - Content */}
        <div className="flex-1 max-w-[576px] w-full">
          <div className="flex flex-col gap-8 md:gap-12 lg:gap-[70px]">
            <div className="flex flex-col gap-6 md:gap-8 lg:gap-11">
              <div className="flex flex-col gap-2">
                <p 
                  className="text-xs md:text-sm lg:text-base font-extrabold uppercase tracking-wider"
                  style={{ color: '#525FE1', letterSpacing: '1.6px' }}
                >
                  Give Back. Change a Future.
                </p>
                <h2 
                  className="text-2xl md:text-3xl lg:text-[40px] font-extrabold leading-tight md:leading-[44px] lg:leading-[56px]"
                  style={{ color: '#231F40' }}
                >
                  Creating A Community Of Life Long Learners
                </h2>
              </div>

              <p 
                className="text-sm md:text-base font-medium leading-relaxed md:leading-[28px]"
                style={{ color: '#6F6B80' }}
              >
                As alumni, we share a common journey—and the power to make a lasting difference. Your donation to the Alumni Support Fund helps students who are facing financial challenges continue their education with confidence and dignity.
              </p>
            </div>

            {/* Bullet Points */}
            <div className="flex flex-col gap-4 md:gap-5">
              {[
                'Flexible training programs',
                'Friendly environment for you',
                'Learn from approved experts'
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 mt-0.5">
                    <Check className="w-full h-full" style={{ color: '#F86F03' }} />
                  </div>
                  <p 
                    className="text-sm md:text-base font-semibold leading-relaxed md:leading-[26px]"
                    style={{ color: '#231F40' }}
                  >
                    {item}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="relative">
              <Button
                className="w-full sm:w-[216px] h-[50px] md:h-[60px] text-base md:text-lg font-bold rounded-[5px] flex items-center justify-center gap-2"
                style={{ 
                  background: '#525FE1',
                  color: '#FFFFFF'
                }}
              >
                Donate now
                <svg 
                  width="18" 
                  height="18" 
                  viewBox="0 0 18 18" 
                  fill="none"
                  style={{ transform: 'rotate(180deg)' }}
                >
                  <path 
                    d="M3 9L15 9M15 9L9 3M15 9L9 15" 
                    stroke="white" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}
