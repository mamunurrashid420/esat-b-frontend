// API Endpoint Constants

const API_BASE = '/api';

export const endpoints = {
  // Authentication
  login: `${API_BASE}/login`,
  logout: `${API_BASE}/logout`,
  register: `${API_BASE}/register`,
  currentUser: `${API_BASE}/user`,
  currentUserProfile: `${API_BASE}/user/profile`,

  // Payments
  payments: `${API_BASE}/payments`,
  payment: (id: number) => `${API_BASE}/payments/${id}`,

  // Self Declarations
  selfDeclarations: `${API_BASE}/self-declarations`,
  selfDeclaration: (id: number) => `${API_BASE}/self-declarations/${id}`,
  selfDeclarationApprove: (id: number) => `${API_BASE}/self-declarations/${id}/approve`,
  selfDeclarationReject: (id: number) => `${API_BASE}/self-declarations/${id}/reject`,

  // Member Types
  memberTypes: `${API_BASE}/member-types`,

  // About Us (public)
  members: `${API_BASE}/about/members`,
  conveningCommittee: `${API_BASE}/about/convening-committee`,
  advisoryBody: `${API_BASE}/about/advisory-body`,
  honorBoard: `${API_BASE}/about/honor-board`,
  batchRepresentatives: `${API_BASE}/about/batch-representatives`,

  // Downloads (public)
  downloads: `${API_BASE}/downloads`,

  // Events (public)
  events: `${API_BASE}/events`,
  event: (id: number) => `${API_BASE}/events/${id}`,
  eventRegister: (id: number) => `${API_BASE}/events/${id}/register`,
  eventUnregister: (id: number) => `${API_BASE}/events/${id}/register`,
  eventRegisterGuest: (id: number) => `${API_BASE}/events/${id}/register-guest`,

  // Scholarships (public)
  scholarships: `${API_BASE}/scholarships`,
  scholarshipApplications: `${API_BASE}/scholarship-applications`,

  // Homepage (public) – combined data for homepage
  homepage: `${API_BASE}/homepage`,
  authPage: `${API_BASE}/auth-page`,
  stats: `${API_BASE}/stats`,
  galleryPhotos: `${API_BASE}/gallery-photos`,
  notices: `${API_BASE}/notices`,
  notice: (id: number) => `${API_BASE}/notices/${id}`,
  news: `${API_BASE}/news`,
  newsBySlug: (slug: string) => `${API_BASE}/news/slug/${encodeURIComponent(slug)}`,
  jobs: `${API_BASE}/jobs`,
  job: (id: number) => `${API_BASE}/jobs/${id}`,
} as const;
