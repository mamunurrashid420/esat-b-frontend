import { createRouter, createRoute, createRootRoute, Outlet, Navigate } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import { HomepageLayout } from '@/layouts/HomepageLayout'
import { UserSpaceLayout } from '@/layouts/UserSpaceLayout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Homepage } from '@/components/Homepage'
import { Registration } from '@/components/Registration'
import { Login } from '@/components/Login'
import { About } from '@/components/About'
import { Scholarship } from '@/components/Scholarship'
import { PrivacyPolicy } from '@/components/PrivacyPolicy'
import { MessageFromPresident } from '@/components/MessageFromPresident'
import { MessageFromGeneralSecretary } from '@/components/MessageFromGeneralSecretary'
import { History } from '@/components/History'
import { MissionAndVision } from '@/components/MissionAndVision'
import { NewsAndEvents } from '@/components/NewsAndEvents'
import { NewsDetail } from '@/components/NewsDetail'
import { NoticeDetail } from '@/components/NoticeDetail'
import { JobDetail } from '@/components/JobDetail'
import { Contact } from '@/components/Contact'
import { Membership } from '@/components/Membership'
import { ExecutiveMembers } from '@/components/ExecutiveMembers'
import { Constitution } from '@/components/Constitution'
import { Downloads } from '@/components/Downloads'
import { EventsList } from '@/components/EventsList'
import { EventDetail } from '@/components/EventDetail'

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster position="top-right" richColors />
    </>
  ),
})

// Homepage route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <HomepageLayout>
      <Homepage />
    </HomepageLayout>
  ),
})

// About route
const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: () => (
    <HomepageLayout>
      <About />
    </HomepageLayout>
  ),
})

// Message from President route
const presidentMessageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about/president',
  component: () => (
    <HomepageLayout>
      <MessageFromPresident />
    </HomepageLayout>
  ),
})

// Message from Secretary General route
const secretaryMessageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about/secretary',
  component: () => (
    <HomepageLayout>
      <MessageFromGeneralSecretary />
    </HomepageLayout>
  ),
})

// History route
const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about/history',
  component: () => (
    <HomepageLayout>
      <History />
    </HomepageLayout>
  ),
})

// Mission & Vision route
const missionVisionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about/mission-vision',
  component: () => (
    <HomepageLayout>
      <MissionAndVision />
    </HomepageLayout>
  ),
})

// Executive Members route
const executiveMembersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about/executive-members',
  component: () => (
    <HomepageLayout>
      <ExecutiveMembers />
    </HomepageLayout>
  ),
})

// Constitution route
const constitutionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/constitution',
  component: () => (
    <HomepageLayout>
      <Constitution />
    </HomepageLayout>
  ),
})

// Login route (optional search: ?redirect=/path to go after login)
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search?.redirect === 'string' ? search.redirect : undefined,
  }),
  component: () => <Login />,
})

// Register route
const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: () => <Registration />,
})

import { Dashboard } from '@/components/Dashboard'
import { Profile } from '@/components/Profile'
import { Payment } from '@/components/Payment'
import { MakePayment } from '@/components/MakePayment'
import { ScholarshipApplicationFormPage } from '@/components/ScholarshipApplicationFormPage'

// Dashboard route
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <ProtectedRoute>
      <UserSpaceLayout title="Dashboard" subtitle="User Information And Details">
        <Dashboard />
      </UserSpaceLayout>
    </ProtectedRoute>
  ),
})

// Profile route
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: () => (
    <ProtectedRoute>
      <UserSpaceLayout title="User Profile" subtitle="User Information And Details">
        <Profile />
      </UserSpaceLayout>
    </ProtectedRoute>
  ),
})

// Payment route
const paymentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment',
  component: () => (
    <ProtectedRoute>
      <UserSpaceLayout title="Payment List" subtitle="Payment Information And Details">
        <Payment />
      </UserSpaceLayout>
    </ProtectedRoute>
  ),
})

// Make Payment route (Dashboard Layout - for logged-in users)
const makePaymentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/make-payment',
  component: () => (
    <ProtectedRoute>
      <UserSpaceLayout title="Payment Page" subtitle="Select your purpose and make your payment">
        <MakePayment showMemberId={false} />
      </UserSpaceLayout>
    </ProtectedRoute>
  ),
})

// Make Payment route (Homepage Layout - for public users)
const makePaymentPublicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/donate',
  component: () => (
    <HomepageLayout>
      <MakePayment showMemberId={true} />
    </HomepageLayout>
  ),
})

// Self Declaration route (disabled – redirects to dashboard)
const selfDeclarationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/self-declaration',
  component: () => <Navigate to="/dashboard" replace />,
})

// Certificate route (disabled – redirects to dashboard)
const certificateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/certificate',
  component: () => <Navigate to="/dashboard" replace />,
})

// Scholarship apply route (member dashboard)
const scholarshipApplyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/scholarship-apply',
  component: () => (
    <ProtectedRoute>
      <UserSpaceLayout title="Apply for Scholarship" subtitle="Submit your scholarship application">
        <ScholarshipApplicationFormPage />
      </UserSpaceLayout>
    </ProtectedRoute>
  ),
})

// Dashboard Events list route
const dashboardEventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/events',
  component: () => (
    <ProtectedRoute>
      <UserSpaceLayout title="Events" subtitle="View and register for events">
        <EventsList dashboardContext />
      </UserSpaceLayout>
    </ProtectedRoute>
  ),
})

// Dashboard Event detail route (optional search: ?register=1 to open registration form)
const dashboardEventDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard/events/$id',
  validateSearch: (search: Record<string, unknown>) => ({
    register: typeof search?.register === 'string' ? search.register : undefined,
  }),
  component: () => (
    <ProtectedRoute>
      <UserSpaceLayout title="Event" subtitle="Event details and registration">
        <EventDetail dashboardContext />
      </UserSpaceLayout>
    </ProtectedRoute>
  ),
})

// Scholarship route
const scholarshipRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/scholarship',
  component: () => (
    <HomepageLayout>
      <Scholarship />
    </HomepageLayout>
  ),
})

// News & Events route
const newsEventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/news-events',
  component: () => (
    <HomepageLayout>
      <NewsAndEvents />
    </HomepageLayout>
  ),
})

// News detail by slug
const newsDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/news-events/$slug',
  component: () => (
    <HomepageLayout>
      <NewsDetail />
    </HomepageLayout>
  ),
})

// Notice detail by id
const noticeDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/notice/$id',
  component: () => (
    <HomepageLayout>
      <NoticeDetail />
    </HomepageLayout>
  ),
})

// Job detail by id
const jobDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/jobs/$id',
  component: () => (
    <HomepageLayout>
      <JobDetail />
    </HomepageLayout>
  ),
})

// Events list route
const eventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events',
  component: () => (
    <HomepageLayout>
      <EventsList />
    </HomepageLayout>
  ),
})

// Event detail route (optional search: ?register=1 to open registration form)
const eventDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events/$id',
  validateSearch: (search: Record<string, unknown>) => ({
    register: typeof search?.register === 'string' ? search.register : undefined,
  }),
  component: () => (
    <HomepageLayout>
      <EventDetail />
    </HomepageLayout>
  ),
})

// Membership route
const membershipRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/membership',
  component: () => (
    <HomepageLayout>
      <Membership />
    </HomepageLayout>
  ),
})

// Downloads route
const downloadsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/downloads',
  component: () => (
    <HomepageLayout>
      <Downloads />
    </HomepageLayout>
  ),
})

// Contact route
const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: () => (
    <HomepageLayout>
      <Contact />
    </HomepageLayout>
  ),
})

// Privacy Policy route
const privacyPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy-policy',
  component: () => (
    <HomepageLayout>
      <PrivacyPolicy />
    </HomepageLayout>
  ),
})

// Create route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  presidentMessageRoute,
  secretaryMessageRoute,
  historyRoute,
  missionVisionRoute,
  executiveMembersRoute,
  constitutionRoute,
  scholarshipRoute,
  newsEventsRoute,
  newsDetailRoute,
  noticeDetailRoute,
  jobDetailRoute,
  eventsRoute,
  eventDetailRoute,
  membershipRoute,
  downloadsRoute,
  contactRoute,
  privacyPolicyRoute,
  loginRoute,
  registerRoute,
  dashboardRoute,
  dashboardEventsRoute,
  dashboardEventDetailRoute,
  profileRoute,
  paymentRoute,
  makePaymentRoute,
  makePaymentPublicRoute,
  selfDeclarationRoute,
  certificateRoute,
  scholarshipApplyRoute,
])

// Create router
export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
