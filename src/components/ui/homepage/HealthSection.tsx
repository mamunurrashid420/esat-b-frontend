import { useEffect, useState } from 'react'
import { Clock, Wifi, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getApiBaseUrl } from '@/api/client'

const healthServices = [
  'Blood Group Database',
  'Ambulance Services',
  'Illness Status Updates',
  'Passed Away Ex-Students List',
  'Hospital & Clinic Contacts and Addresses'
]

function getImageUrl(url: string | null | undefined): string | undefined {
  if (!url || typeof url !== 'string') return undefined
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const apiBase = getApiBaseUrl()
  return apiBase ? `${apiBase}${url.startsWith('/') ? url : `/${url}`}` : url
}

export interface HealthSectionProps {
  /** Main image URL (from API). */
  mainImageUrl?: string | null
  /** Overlapping image URL (from API). */
  overlappingImageUrl?: string | null
}

export function HealthSection({ mainImageUrl, overlappingImageUrl }: HealthSectionProps = {}) {
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
    <section className="w-full py-12 md:py-16 lg:py-20 flex flex-col items-center">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 box-border">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-[62px]">
        {/* Left Side - Image Collage with Stats */}
        <div 
          className="relative shrink-0 w-full lg:w-[684px] h-[500px] md:h-[600px] lg:h-[760px]"
          style={{
            flex: 'none',
            order: 0,
            flexGrow: 0
          }}
        >
          {/* Main image – from API; no default on reload */}
          {showMainImage ? (
            <img 
              src={dynamicMainUrl}
              alt="Supporting Alumni Health & Wellness"
              className="absolute left-[22px] md:left-[32px] lg:left-[43px] top-0 w-[calc(100%-44px)] md:w-[calc(100%-64px)] lg:w-[536px] h-[calc(50%-20px)] md:h-[calc(55%-30px)] lg:h-[488px] rounded-[20px] md:rounded-[30px] lg:rounded-[40px] object-cover"
              style={{ transform: 'rotate(5deg)', borderRadius: '20px 20px 20px 0' }}
              onError={() => setMainError(true)}
            />
          ) : (
            <div 
              className="absolute left-[22px] md:left-[32px] lg:left-[43px] top-0 w-[calc(100%-44px)] md:w-[calc(100%-64px)] lg:w-[536px] h-[calc(50%-20px)] md:h-[calc(55%-30px)] lg:h-[488px] rounded-[20px] md:rounded-[30px] lg:rounded-[40px] bg-muted"
              style={{ transform: 'rotate(5deg)', borderRadius: '20px 20px 20px 0' }}
              aria-hidden
            />
          )}

          {/* Overlapping image – from API; no default on reload */}
          {showOverlapImage ? (
            <img 
              src={dynamicOverlapUrl}
              alt="Alumni community"
              className="absolute right-0 bottom-[29px] md:bottom-[44px] lg:bottom-[58px] w-[45%] md:w-[50%] lg:w-[364px] h-[calc(45%-20px)] md:h-[calc(50%-30px)] lg:h-[352px] rounded-[20px] md:rounded-[30px] lg:rounded-[40px] z-10 object-cover"
              style={{ transform: 'rotate(5deg)' }}
              onError={() => setOverlapError(true)}
            />
          ) : (
            <div 
              className="absolute right-0 bottom-[29px] md:bottom-[44px] lg:bottom-[58px] w-[45%] md:w-[50%] lg:w-[364px] h-[calc(45%-20px)] md:h-[calc(50%-30px)] lg:h-[352px] rounded-[20px] md:rounded-[30px] lg:rounded-[40px] bg-muted z-10"
              style={{ transform: 'rotate(5deg)' }}
              aria-hidden
            />
          )}

          {/* Stats Box - Bottom Left (Purple Box) */}
          <div 
            className="absolute left-0 bottom-[30px] md:bottom-[45px] lg:bottom-[60px] rounded-[15px] md:rounded-[18px] lg:rounded-[20px] flex items-center justify-center z-20 w-[150px] md:w-[220px] lg:w-[300px] h-[100px] md:h-[150px] lg:h-[200px]"
            style={{ 
              background: '#7166F5',
              transform: 'rotate(5deg)'
            }}
          >
            <div className="flex flex-col items-center justify-center h-full px-2 md:px-3 lg:px-4 text-center">
              <div 
                className="text-2xl md:text-3xl lg:text-[48px] font-extrabold leading-tight md:leading-[40px] lg:leading-[52px] mb-1 md:mb-2"
                style={{ color: '#FFFFFF' }}
              >
                40+
              </div>
              <p 
                className="text-xs md:text-base lg:text-xl font-extrabold leading-tight md:leading-[22px] lg:leading-[26px]"
                style={{ color: '#D0CCFF' }}
              >
                Alumni students
              </p>
              <p 
                className="text-xs md:text-base lg:text-xl font-extrabold leading-tight md:leading-[22px] lg:leading-[26px]"
                style={{ color: '#D0CCFF' }}
              >
                are ready
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="w-full lg:w-[500px] flex flex-col items-start gap-8 md:gap-10 min-h-0 lg:min-h-[711px]">
            {/* Header */}
            <div className="flex flex-col gap-3 md:gap-4">
              <h2 
                className="text-2xl md:text-3xl lg:text-[40px] font-extrabold leading-tight md:leading-[44px] lg:leading-[52px]"
                style={{ color: '#211F38' }}
              >
                Supporting Alumni Health & Wellness
              </h2>
              <p 
                className="text-sm md:text-base font-semibold leading-relaxed md:leading-[28px]"
                style={{ color: '#737092' }}
              >
                Explore valuable health resources available to you as a member of our alumni community. Get benefits that support you.
              </p>
            </div>

            {/* Feature Blocks */}
            <div className="flex flex-col sm:flex-row gap-6 md:gap-8">
              {/* Fast & Easy Process */}
              <div className="w-full sm:w-[250px]">
                <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 lg:w-11 lg:h-11">
                    <Clock className="w-full h-full" style={{ color: '#7166F5' }} />
                  </div>
                  <h3 
                    className="text-sm md:text-base font-extrabold leading-tight md:leading-[19px]"
                    style={{ color: '#211F38' }}
                  >
                    Fast & Easy Process
                  </h3>
                </div>
                <p 
                  className="text-sm md:text-base font-semibold leading-relaxed md:leading-[28px]"
                  style={{ color: '#737092' }}
                >
                  Get your service response at the shortest possible time
                </p>
              </div>

              {/* Control Over Policy */}
              <div className="w-full sm:w-[250px]">
                <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 lg:w-11 lg:h-11">
                    <Wifi className="w-full h-full" style={{ color: '#7166F5' }} />
                  </div>
                  <h3 
                    className="text-sm md:text-base font-extrabold leading-tight md:leading-[19px]"
                    style={{ color: '#211F38' }}
                  >
                    Control Over Policy
                  </h3>
                </div>
                <p 
                  className="text-sm md:text-base font-semibold leading-relaxed md:leading-[28px]"
                  style={{ color: '#737092' }}
                >
                  Relevant students will be notified through the system
                </p>
              </div>
            </div>

            {/* Services List */}
            <div 
              className="w-full p-4 md:p-6 lg:p-8 rounded-[10px]"
              style={{
                border: '1px solid #D0CCFF',
              }}
            >
              <div className="flex flex-col gap-3 md:gap-4">
                {healthServices.map((service, index) => (
                  <div key={index} className="flex items-center gap-3 md:gap-4">
                    <div className="w-[16px] h-[16px] md:w-[18px] md:h-[18px] shrink-0">
                      <Check className="w-full h-full" style={{ color: '#7166F5' }} />
                    </div>
                    <p 
                      className="text-sm md:text-base font-bold leading-relaxed md:leading-[24px]"
                      style={{ color: '#211F38' }}
                    >
                      {service}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <Button
              className="w-full sm:w-[190px] h-[50px] md:h-[56px] rounded-[10px] text-sm md:text-base font-bold"
              style={{ 
                background: '#211F38',
                color: '#FFFFFF'
              }}
            >
              Discover More
            </Button>
        </div>
        </div>
      </div>
    </section>
  )
}
