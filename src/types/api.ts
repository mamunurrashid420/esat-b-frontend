// API Response Types

export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type SelfDeclarationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type PaymentPurpose =
  | 'ASSOCIATE_MEMBERSHIP_FEES'
  | 'GENERAL_MEMBERSHIP_FEES'
  | 'LIFETIME_MEMBERSHIP_FEES'
  | 'SPECIAL_YEARLY_CONTRIBUTION_EXECUTIVE'
  | 'DONATIONS'
  | 'PATRON'
  | 'OTHERS';

export type MembershipType = 'GENERAL' | 'LIFETIME' | 'ASSOCIATE';

export interface MemberType {
  id: number;
  name: string;
  description: string | null;
}

export interface SelfDeclaration {
  id: number;
  user?: {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    member_id: string | null;
  };
  name: string;
  signature_file: string | null;
  secondary_member_type?: MemberType;
  date: string;
  status: SelfDeclarationStatus;
  approved_by?: {
    id: number;
    name: string;
  };
  approved_at: string | null;
  rejected_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface MembershipApplication {
  id: number;
  membership_type: MembershipType | null;
  full_name: string;
  name_bangla: string | null;
  father_name: string | null;
  mother_name: string | null;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | null;
  jsc_year: number | null;
  ssc_year: number | null;
  studentship_proof_type: string | null;
  studentship_proof_file: string | null;
  highest_educational_degree: string | null;
  present_address: string | null;
  permanent_address: string | null;
  email: string;
  mobile_number: string | null;
  profession: string | null;
  designation: string | null;
  institute_name: string | null;
  t_shirt_size: string | null;
  blood_group: string | null;
  entry_fee: number | null;
  yearly_fee: number | null;
  payment_years: number | string | null;
  total_paid_amount: number | null;
  receipt_file: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | null;
  approved_by: number | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MemberProfile {
  id: number;
  name_bangla: string | null;
  father_name: string | null;
  mother_name: string | null;
  gender: string | null;
  jsc_year: number | null;
  ssc_year: number | null;
  highest_educational_degree: string | null;
  present_address: string | null;
  permanent_address: string | null;
  profession: string | null;
  designation: string | null;
  institute_name: string | null;
  t_shirt_size: string | null;
  blood_group: string | null;
  photo: string | null;
  signature: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  role: 'super_admin' | 'member';
  primary_member_type: MembershipType | null;
  secondary_member_type_id: number | null;
  secondary_member_type?: MemberType | null;
  latest_self_declaration?: SelfDeclaration | null;
  member_id: string | null;
  membership_expires_at: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  profile: MemberProfile | null;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

export interface LogoutResponse {
  message: string;
}

export interface Payment {
  id: number;
  member_id: string | null;
  name: string;
  address: string;
  mobile_number: string;
  payment_purpose: PaymentPurpose;
  payment_amount: number;
  payment_proof_file: string | null;
  status: PaymentStatus;
  approved_by: number | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Scholarships (public)
export interface Scholarship {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ScholarshipListResponse {
  data: Scholarship[];
}

export interface ScholarshipApplicationSubmitResponse {
  data: {
    id: number;
    scholarship_id: number;
    applicant_name: string;
    status: string;
    created_at: string;
  };
}

// About Us (public)
export type HonorBoardRole = 'President' | 'GeneralSecretary';

export interface ConveningCommitteeMember {
  id: number;
  name: string;
  mobile_number: string | null;
  designation: string | null;
  occupation: string | null;
  photo: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface AdvisoryBodyMember {
  id: number;
  name: string;
  mobile_number: string | null;
  designation: string | null;
  occupation: string | null;
  photo: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface HonorBoardEntry {
  id: number;
  role: HonorBoardRole;
  name: string;
  member_id: string | null;
  durations: string | null;
  photo: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BatchRepresentative {
  id: number;
  name: string;
  mobile_number: string | null;
  ssc_batch: string | null;
  photo: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface AboutListResponse<T> {
  data: T[];
}

export type EventStatus = 'draft' | 'open' | 'closed';

export interface EventPhoto {
  id: number;
  url: string;
  sort_order: number;
}

export interface Event {
  id: number;
  title: string;
  description: string | null;
  short_description: string | null;
  location: string | null;
  event_at: string;
  registration_opens_at: string;
  registration_closes_at: string;
  status: EventStatus;
  cover_photo: string | null;
  fee: number | null;
  photos?: EventPhoto[];
  registration_count?: number;
  is_registered?: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventListResponse {
  data: Event[];
}

export interface EventDetailResponse {
  data: Event;
}

export interface Download {
  id: number;
  title: string;
  description: string | null;
  file_url: string | null;
  sort_order: number;
  created_at: string;
}

/** Public member list item (no sensitive data) */
export interface PublicMember {
  id: number;
  name: string;
  member_id: string | null;
  primary_member_type: MembershipType | null;
  secondary_member_type?: MemberType | null;
  designation: string | null;
  profession: string | null;
  institute_name: string | null;
  photo: string | null;
}

/** Homepage stats (public) */
export interface HomepageStats {
  members: number;
  events: number;
  photos: number;
  awards: number;
}

/** Gallery photo (public) */
export interface GalleryPhoto {
  id: number;
  url: string | null;
  category: string;
  sort_order: number;
}

export interface GalleryPhotoListResponse {
  data: GalleryPhoto[];
}

/** Notice (scrolling bar / detail page) */
export interface NoticeItem {
  id: number;
  title: string;
  body: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface NoticeListResponse {
  data: NoticeItem[];
}

/** News item (public list / detail) */
export interface NewsItem {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  body: string | null;
  image: string | null;
  author: string | null;
  published_at: string | null;
  is_published?: boolean;
  sort_order?: number;
  created_at: string;
  updated_at: string;
}

export interface NewsListResponse {
  data: NewsItem[];
}

/** Job listing (public) */
export interface JobListing {
  id: number;
  title: string;
  description: string | null;
  company_name: string | null;
  logo: string | null;
  status: 'active' | 'expired';
  application_url: string | null;
  closes_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobListResponse {
  data: JobListing[];
}

/** Single hero slide from API (homepage slider). */
export interface HeroSlideItem {
  id: number;
  image: string | null;
  title: string;
  subtitle: string | null;
  description: string | null;
  primary_button_label: string | null;
  primary_button_url: string | null;
  secondary_button_label: string | null;
  secondary_button_url: string | null;
  sort_order: number;
  is_active?: boolean;
}

export interface HeroSlideListResponse {
  data: HeroSlideItem[];
}

/** About section images (homepage About Us). */
export interface AboutSectionData {
  main_image: string | null;
  overlapping_image: string | null;
}

/** Health section images (homepage Supporting Alumni Health & Wellness). */
export interface HealthSectionData {
  main_image: string | null;
  overlapping_image: string | null;
}

/** Community section image (homepage Give Back / Life Long Learners). */
export interface CommunitySectionData {
  image: string | null;
}

/** Combined response for GET /api/homepage (all data needed for the public homepage). */
export interface HomepageResponse {
  notices: NoticeListResponse;
  events: EventListResponse;
  gallery_photos: GalleryPhotoListResponse;
  slider_slides?: HeroSlideListResponse;
  about_section?: AboutSectionData;
  health_section?: HealthSectionData;
  community_section?: CommunitySectionData;
  jobs: JobListResponse;
  news: NewsListResponse;
  stats: HomepageStats;
}
