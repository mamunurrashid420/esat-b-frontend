import { useEffect, useState } from 'react'
import { NoticeBar } from '@/components/ui/homepage/NoticeBar'
import { HeroSection } from '@/components/ui/homepage/HeroSection'
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

export function Homepage() {
  const [data, setData] = useState<HomepageResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient
      .getHomepage()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="relative w-full">
      <NoticeBar notices={data?.notices.data ?? []} loading={loading} />
      <HeroSection />
      <GetTogetherBanner events={data?.events.data ?? []} loading={loading} />
      <AboutUsSection />
      <OurResponsibilitySection />
      <StatisticsSection stats={data?.stats ?? null} loading={loading} />
      <GallerySection photos={data?.gallery_photos.data ?? []} loading={loading} />
      <ScholarshipSection />
      <CommunitySection />
      <HealthSection />
      <RecentNewsSection news={data?.news.data ?? []} loading={loading} />
      <UpcomingEventsSection events={data?.events.data ?? []} loading={loading} />
      <RecentJobsSection jobs={data?.jobs.data ?? []} loading={loading} />
    </div>
  )
}
