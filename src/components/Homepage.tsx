import { useEffect, useState } from 'react'
import { NoticeBar } from '@/components/ui/homepage/NoticeBar'
import { HeroSlider } from '@/components/ui/homepage/HeroSlider'
import { GetTogetherBanner } from '@/components/ui/homepage/GetTogetherBanner'
import { AboutUsSection } from '@/components/ui/homepage/AboutUsSection'
import { OurResponsibilitySection } from '@/components/ui/homepage/OurResponsibilitySection'
import { StatisticsSection } from '@/components/ui/homepage/StatisticsSection'
import { RecentJobsSection } from '@/components/ui/homepage/RecentJobsSection'
import { GallerySection } from '@/components/ui/homepage/GallerySection'
import { ScholarshipSection } from '@/components/ui/homepage/ScholarshipSection'
import { CommunitySection } from '@/components/ui/homepage/CommunitySection'
import { HealthSection } from '@/components/ui/homepage/HealthSection'
import { RecentNewsSection } from '@/components/ui/homepage/RecentNewsSection'
import { UpcomingEventsSection } from '@/components/ui/homepage/UpcomingEventsSection'
import { apiClient } from '@/api/client'
import type { HomepageResponse } from '@/types/api'

function fetchHomepage(setData: (d: HomepageResponse | null) => void, setLoading: (l: boolean) => void) {
  setLoading(true)
  apiClient
    .getHomepage()
    .then(setData)
    .catch(() => setData(null))
    .finally(() => setLoading(false))
}

export function Homepage() {
  const [data, setData] = useState<HomepageResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHomepage(setData, setLoading)
  }, [])

  // Refetch when user returns to this tab (e.g. after uploading images in admin)
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') fetchHomepage(setData, setLoading)
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  return (
    <div className="relative w-full">
      <NoticeBar notices={data?.notices.data ?? []} loading={loading} />
      <HeroSlider apiSlides={data?.slider_slides?.data} />
      <GetTogetherBanner events={data?.events.data ?? []} loading={loading} />
      <AboutUsSection
        mainImageUrl={data?.about_section?.main_image}
        overlappingImageUrl={data?.about_section?.overlapping_image}
      />
      <OurResponsibilitySection />
      <StatisticsSection stats={data?.stats ?? null} loading={loading} />
      <GallerySection photos={data?.gallery_photos.data ?? []} loading={loading} />
      <ScholarshipSection />
      <CommunitySection imageUrl={data?.community_section?.image} />
      <HealthSection
        mainImageUrl={data?.health_section?.main_image}
        overlappingImageUrl={data?.health_section?.overlapping_image}
      />
      <RecentNewsSection news={data?.news.data ?? []} loading={loading} />
      <UpcomingEventsSection events={data?.events.data ?? []} loading={loading} />
      <RecentJobsSection jobs={data?.jobs.data ?? []} loading={loading} />
    </div>
  )
}
