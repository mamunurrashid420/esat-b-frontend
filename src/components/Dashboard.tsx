import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Award, FileText } from 'lucide-react'
import { WelcomeBanner } from './dashboard/WelcomeBanner'
import { InfoCard } from './dashboard/InfoCard'
import { NotificationsSection } from './dashboard/NotificationsSection'
import { SubscriptionSection } from './dashboard/SubscriptionSection'
import { ProfileCard } from './dashboard/ProfileCard'
import { EventsSection } from './dashboard/EventsSection'
import { useAuthStore } from '@/stores/authStore'

export function Dashboard() {
  const navigate = useNavigate()
  const { fetchUser, isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    const loadUser = async () => {
      if (!isAuthenticated) {
        try {
          await fetchUser()
        } catch (error) {
          navigate({ to: '/login' })
        }
      }
    }

    loadUser()
  }, [fetchUser, isAuthenticated, navigate])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B60C9]"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
      {/* Main Content */}
      <div className="flex-1 space-y-4 md:space-y-6">
        {/* Welcome Banner */}
        <WelcomeBanner />

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <InfoCard
            icon={
              <Award className="w-12 h-12 text-yellow-500" />
            }
            title="Membership certificate"
            description="View and download your official membership certificate from ESAT-B. This certificate verifies your membership status and can be used for official purposes."
            actionIcon="arrow"
            onAction={() => navigate({ to: '/certificate' })}
          />
          <InfoCard
            icon={
              <div className="relative">
                <FileText className="w-12 h-12 text-blue-500" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
            }
            title="Payment history"
            description="The App Is A Great Way To Stay Connected With Your Colleagues And Learn About What They're Working On. You Can Also Use The App"
            actionIcon="arrow"
            onAction={() => navigate({ to: '/payment' })}
          />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <NotificationsSection />
          <SubscriptionSection />
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="w-full lg:w-96 space-y-4 md:space-y-6">
        <ProfileCard />
        <EventsSection />
      </aside>
    </div>
  )
}
