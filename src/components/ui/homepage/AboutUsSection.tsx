import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import event1 from '@/assets/alumni/event/1.jpg'
import event2 from '@/assets/alumni/event/2.jpg'
import event3 from '@/assets/alumni/event/3.jpeg'
import event4 from '@/assets/alumni/event/4.jpeg'
import gallery1 from '@/assets/alumni/gallery/1.jpg'
import gallery2 from '@/assets/alumni/gallery/2.jpg'
import gallery3 from '@/assets/alumni/gallery/3.jpeg'
import gallery4 from '@/assets/alumni/gallery/4.jpeg'
import galleryBatch2005 from '@/assets/alumni/gallery/Batch-2005.jpg'
import oldCoaching from '@/assets/alumni/old-coaching.jpeg'

// Array of all available images (excluding logo)
const alumniImages = [event1, event2, event3, event4, gallery1, gallery2, gallery3, gallery4, galleryBatch2005, oldCoaching]

const SHORT_TEXT_LENGTH = 280

const fullText = `The Ex-Students Association Of Textile Engineering College, Barishal (ESAT-B) serves as the heart of our alumni community, connecting former students from different batches and backgrounds. The association is established with the vision of building strong bridges among the alumni, actively contributing to the welfare and overall development of both the college and its alumni through cooperation and collective initiatives.

Textile Engineering College, Barishal has shaped future leaders, professionals, and change-makers. We take immense pride in celebrating the achievements and contributions of our alumni across various fields. ESAT-B aims to strengthen this proud legacy by organizing meaningful events, creating networking opportunities, and supporting initiatives that benefit both alumni and current students.

Through reunions, mentorship programs, educational support, and community outreach activities, the association strives to ensure that every member feels connected, valued, and empowered to make a positive difference. ESAT-B provides a platform where lifelong bonds are nurtured, knowledge is shared and collaboration is encouraged for mutual growth.

Through this platform, alumni will maintain and nurture the bond among themselves and contribute to the overall development of the college & ex-students. ESAT-B also deeply respects the contribution of the great persons who established & developed the college. Let's keep the spirit of Textile Engineering College, Barishal alive and soar together toward new horizons.`

export function AboutUsSection() {
  const [isExpanded, setIsExpanded] = useState(false)
  const mainImage = useMemo(() => alumniImages[Math.floor(Math.random() * alumniImages.length)], [])
  const overlappingImage = useMemo(() => alumniImages[Math.floor(Math.random() * alumniImages.length)], [])
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
              background: '#3B60C9',
              clipPath: 'polygon(0 0, 0 100%, 100% 0)'
            }}
          />
          
          {/* Main Image */}
          <img 
            src={mainImage}
            alt="Students learning"
            className="absolute left-[18px] md:left-[28px] lg:left-[35px] top-[18px] md:top-[28px] lg:top-[35px] w-[calc(100%-36px)] md:w-[calc(100%-56px)] lg:w-[403px] h-[calc(100%-36px)] md:h-[calc(100%-56px)] lg:h-[433px] rounded object-cover"
          />
          
          {/* Overlapping Image */}
          <img 
            src={overlappingImage}
            alt="Students studying"
            className="absolute right-0 bottom-0 w-[40%] md:w-[45%] lg:w-[227px] h-[60%] md:h-[65%] lg:h-[312px] rounded shadow-lg object-cover"
            style={{ 
              boxShadow: '0px 0px 94.47px rgba(0, 0, 0, 0.24)'
            }}
          />
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
                style={{ color: '#021E40' }}
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
                  style={{ color: '#3B60C9' }}
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
