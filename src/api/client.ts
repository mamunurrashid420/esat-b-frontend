import axios, { AxiosError } from 'axios';
import type { AxiosInstance } from 'axios';
import type {
  LoginResponse,
  RegisterResponse,
  User,
  LogoutResponse,
  PaginatedResponse,
  Payment,
  ApiError,
  SelfDeclaration,
  MemberType,
  PublicMember,
  ConveningCommitteeMember,
  AdvisoryBodyMember,
  HonorBoardEntry,
  BatchRepresentative,
  AboutListResponse,
  Download,
  Event,
  EventListResponse,
  EventDetailResponse,
  ScholarshipListResponse,
  ScholarshipApplicationSubmitResponse,
  HomepageStats,
  GalleryPhotoListResponse,
  NoticeItem,
  NoticeListResponse,
  NewsItem,
  NewsListResponse,
  JobListResponse,
  JobListing,
  HomepageResponse,
} from '@/types/api';
import { endpoints } from './endpoints';
import { getCookie, setCookie, removeCookie } from '@/lib/cookie';

const AUTH_TOKEN_COOKIE = 'auth_token';
/** Cookie key used by Zustand persist for auth store (must stay in sync with authStore persist name) */
const AUTH_STORAGE_COOKIE = 'auth-storage';

/** Same base URL as API requests – use for image URLs from API (e.g. About section). */
export const getApiBaseUrl = (): string =>
  (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000') {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Request interceptor: add auth token; drop Content-Type for FormData so multipart is used
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        if (config.data instanceof FormData) {
          delete config.headers['Content-Type'];
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        // Handle 401 - Unauthorized (token expired/invalid)
        if (error.response?.status === 401) {
          this.clearToken();
          removeCookie(AUTH_STORAGE_COOKIE);
          window.location.href = '/login';
        }

        // Transform error to a more usable format
        if (error.response) {
          const apiError: ApiError = {
            message:
              error.response.data?.message ||
              `HTTP error! status: ${error.response.status}`,
            errors: error.response.data?.errors,
          };
          return Promise.reject(apiError);
        }
        return Promise.reject({
          message: error.message || 'An error occurred',
        } as ApiError);
      }
    );
  }

  getToken(): string | null {
    return getCookie(AUTH_TOKEN_COOKIE);
  }

  setToken(token: string): void {
    setCookie(AUTH_TOKEN_COOKIE, token);
  }

  clearToken(): void {
    removeCookie(AUTH_TOKEN_COOKIE);
    removeCookie(AUTH_STORAGE_COOKIE);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Authentication methods
  async login(emailOrPhone: string, password: string): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>(endpoints.login, {
      email_or_phone: emailOrPhone,
      password,
    });
    
    if (response.data.token) {
      this.setToken(response.data.token);
    }
    return response.data;
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    primary_member_type?: string;
    secondary_member_type_id?: number;
  }): Promise<RegisterResponse> {
    const response = await this.client.post<RegisterResponse>(endpoints.register, data);
    
    if (response.data.token) {
      this.setToken(response.data.token);
    }
    return response.data;
  }

  async logout(): Promise<LogoutResponse> {
    const response = await this.client.post<LogoutResponse>(endpoints.logout);
    this.clearToken();
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<User>(endpoints.currentUser);
    return response.data;
  }

  async updateProfile(data: {
    name: string;
    email?: string | null;
    phone: string;
  }): Promise<User> {
    const response = await this.client.put<User>(endpoints.currentUser, data);
    return response.data;
  }

  async updateMemberProfile(data: {
    name_bangla?: string | null;
    father_name?: string | null;
    mother_name?: string | null;
    gender?: string | null;
    jsc_year?: number | null;
    ssc_year?: number | null;
    highest_educational_degree?: string | null;
    present_address?: string | null;
    permanent_address?: string | null;
    profession?: string | null;
    designation?: string | null;
    institute_name?: string | null;
    t_shirt_size?: string | null;
    blood_group?: string | null;
    photo?: File | null;
  }): Promise<User> {
    const { photo, ...rest } = data;
    if (photo) {
      const formData = new FormData();
      Object.entries(rest).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          formData.append(key, String(value));
        }
      });
      formData.append('photo', photo);
      const response = await this.client.post<User>(
        endpoints.currentUserProfile,
        formData
      );
      return response.data;
    }
    const response = await this.client.put<User>(
      endpoints.currentUserProfile,
      rest
    );
    return response.data;
  }

  // Payment methods
  async getPayments(status?: PaymentStatus): Promise<PaginatedResponse<Payment>> {
    const params = status ? { status } : {};
    const response = await this.client.get<PaginatedResponse<Payment>>(
      endpoints.payments,
      { params }
    );
    return response.data;
  }

  async getPayment(id: number): Promise<{ data: Payment }> {
    const response = await this.client.get<{ data: Payment }>(
      endpoints.payment(id)
    );
    return response.data;
  }

  // Self Declaration methods
  async submitSelfDeclaration(data: {
    name: string;
    signature_file: File;
    secondary_member_type_id: number;
    date: string;
  }): Promise<{ data: SelfDeclaration }> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('signature_file', data.signature_file);
    formData.append('secondary_member_type_id', data.secondary_member_type_id.toString());
    formData.append('date', data.date);

    const response = await this.client.post<{ data: SelfDeclaration }>(
      endpoints.selfDeclarations,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  // Member Type methods
  async getMemberTypes(): Promise<{ data: MemberType[] }> {
    const response = await this.client.get<{ data: MemberType[] }>(
      endpoints.memberTypes
    );
    return response.data;
  }

  // About Us (public)
  async getConveningCommittee(): Promise<AboutListResponse<ConveningCommitteeMember>> {
    const response = await this.client.get<AboutListResponse<ConveningCommitteeMember>>(
      endpoints.conveningCommittee
    );
    return response.data;
  }

  async getAdvisoryBody(): Promise<AboutListResponse<AdvisoryBodyMember>> {
    const response = await this.client.get<AboutListResponse<AdvisoryBodyMember>>(
      endpoints.advisoryBody
    );
    return response.data;
  }

  async getHonorBoard(): Promise<AboutListResponse<HonorBoardEntry>> {
    const response = await this.client.get<AboutListResponse<HonorBoardEntry>>(
      endpoints.honorBoard
    );
    return response.data;
  }

  async getBatchRepresentatives(): Promise<AboutListResponse<BatchRepresentative>> {
    const response = await this.client.get<AboutListResponse<BatchRepresentative>>(
      endpoints.batchRepresentatives
    );
    return response.data;
  }

  /** Public downloads list (no auth required). */
  async getDownloads(): Promise<AboutListResponse<Download>> {
    const response = await this.client.get<AboutListResponse<Download>>(
      endpoints.downloads
    );
    return response.data;
  }

  /** Public events list (no auth required). */
  async getEvents(params?: {
    status?: 'open' | 'closed';
    upcoming?: boolean;
  }): Promise<EventListResponse> {
    const response = await this.client.get<EventListResponse>(
      endpoints.events,
      { params }
    );
    return response.data;
  }

  /** Public event detail (no auth required for open/closed). */
  async getEvent(id: number): Promise<EventDetailResponse> {
    const response = await this.client.get<EventDetailResponse>(
      endpoints.event(id)
    );
    return response.data;
  }

  /** Register current user for event (auth required, member only). */
  async registerForEvent(
    id: number,
    data?: {
      name?: string | null;
      phone?: string | null;
      address?: string | null;
      ssc_jsc?: string | null;
      notes?: string | null;
      guest_count?: number;
      guest_details?: string | null;
      participant_fee?: number | null;
      total_fees?: number | null;
      payment_document?: File | null;
    }
  ): Promise<{ message: string }> {
    const payload = data ?? {};
    const hasFile = payload.payment_document != null;
    if (hasFile) {
      const formData = new FormData();
      if (payload.name != null) formData.append('name', payload.name);
      if (payload.phone != null) formData.append('phone', payload.phone);
      if (payload.address != null) formData.append('address', payload.address);
      if (payload.ssc_jsc != null) formData.append('ssc_jsc', payload.ssc_jsc);
      if (payload.notes != null) formData.append('notes', payload.notes);
      if (payload.guest_count != null) formData.append('guest_count', String(payload.guest_count));
      if (payload.guest_details != null) formData.append('guest_details', payload.guest_details);
      if (payload.participant_fee != null) formData.append('participant_fee', String(payload.participant_fee));
      if (payload.total_fees != null) formData.append('total_fees', String(payload.total_fees));
      formData.append('payment_document', payload.payment_document!);
      const response = await this.client.post<{ message: string }>(
        endpoints.eventRegister(id),
        formData
      );
      return response.data;
    }
    const response = await this.client.post<{ message: string }>(
      endpoints.eventRegister(id),
      {
        name: payload.name ?? undefined,
        phone: payload.phone ?? undefined,
        address: payload.address ?? undefined,
        ssc_jsc: payload.ssc_jsc ?? undefined,
        notes: payload.notes ?? undefined,
        guest_count: payload.guest_count ?? undefined,
        guest_details: payload.guest_details ?? undefined,
        participant_fee: payload.participant_fee ?? undefined,
        total_fees: payload.total_fees ?? undefined,
      }
    );
    return response.data;
  }

  /** Unregister current user from event (auth required). */
  async unregisterFromEvent(id: number): Promise<void> {
    await this.client.delete(endpoints.eventUnregister(id));
  }

  /** Register guest for event (no auth). */
  async registerGuestForEvent(
    id: number,
    data: {
      name: string;
      phone: string;
      address: string;
      ssc_jsc?: string | null;
      notes?: string | null;
      guest_count?: number;
      guest_details?: string | null;
      participant_fee?: number | null;
      total_fees?: number | null;
      payment_document?: File | null;
    }
  ): Promise<{ message: string }> {
    const hasFile = data.payment_document != null;
    if (hasFile) {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('phone', data.phone);
      formData.append('address', data.address);
      if (data.ssc_jsc != null) formData.append('ssc_jsc', data.ssc_jsc);
      if (data.notes != null) formData.append('notes', data.notes);
      if (data.guest_count != null) formData.append('guest_count', String(data.guest_count));
      if (data.guest_details != null) formData.append('guest_details', data.guest_details);
      if (data.participant_fee != null) formData.append('participant_fee', String(data.participant_fee));
      if (data.total_fees != null) formData.append('total_fees', String(data.total_fees));
      formData.append('payment_document', data.payment_document!);
      const response = await this.client.post<{ message: string }>(
        endpoints.eventRegisterGuest(id),
        formData
      );
      return response.data;
    }
    const response = await this.client.post<{ message: string }>(
      endpoints.eventRegisterGuest(id),
      {
        name: data.name,
        phone: data.phone,
        address: data.address,
        ssc_jsc: data.ssc_jsc ?? undefined,
        notes: data.notes ?? undefined,
        guest_count: data.guest_count ?? undefined,
        guest_details: data.guest_details ?? undefined,
        participant_fee: data.participant_fee ?? undefined,
        total_fees: data.total_fees ?? undefined,
      }
    );
    return response.data;
  }

  /** Public paginated member list (no auth required). */
  async getMembers(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    primary_member_type?: string;
    has_secondary_type?: boolean;
    secondary_member_type_id?: number;
  }): Promise<PaginatedResponse<PublicMember>> {
    const response = await this.client.get<PaginatedResponse<PublicMember>>(
      endpoints.members,
      { params }
    );
    return response.data;
  }

  /** Public scholarships list (active only, no auth required). */
  async getScholarships(): Promise<ScholarshipListResponse> {
    const response = await this.client.get<ScholarshipListResponse>(
      endpoints.scholarships
    );
    return response.data;
  }

  /** Submit scholarship application (public; auth optional for user_id). */
  async submitScholarshipApplication(
    formData: FormData
  ): Promise<ScholarshipApplicationSubmitResponse> {
    const response = await this.client.post<ScholarshipApplicationSubmitResponse>(
      endpoints.scholarshipApplications,
      formData
    );
    return response.data;
  }

  /** Combined homepage data (public). Single request for notices, events, gallery, jobs, news, stats. */
  async getHomepage(): Promise<HomepageResponse> {
    const response = await this.client.get<HomepageResponse>(endpoints.homepage);
    return response.data;
  }

  /** Auth page background image for login/registration (public). */
  async getAuthPage(): Promise<{ data: { background_image: string | null } }> {
    const response = await this.client.get<{ data: { background_image: string | null } }>(
      endpoints.authPage
    );
    return response.data;
  }

  /** Homepage stats (public). */
  async getStats(): Promise<HomepageStats> {
    const response = await this.client.get<HomepageStats>(endpoints.stats);
    return response.data;
  }

  /** Gallery photos (public). */
  async getGalleryPhotos(params?: { category?: string }): Promise<GalleryPhotoListResponse> {
    const response = await this.client.get<GalleryPhotoListResponse>(
      endpoints.galleryPhotos,
      { params }
    );
    return response.data;
  }

  /** Notices list, active only (public, for scrolling bar). */
  async getNotices(): Promise<NoticeListResponse> {
    const response = await this.client.get<NoticeListResponse>(endpoints.notices);
    return response.data;
  }

  /** Single notice by id (public: active only). */
  async getNotice(id: number): Promise<{ data: NoticeItem }> {
    const response = await this.client.get<{ data: NoticeItem }>(
      endpoints.notice(id)
    );
    return response.data;
  }

  /** News list, published only (public). */
  async getNews(params?: { per_page?: number }): Promise<NewsListResponse> {
    const response = await this.client.get<NewsListResponse>(endpoints.news, {
      params: params ?? {},
    });
    return response.data;
  }

  /** Single news by slug (public: published only). */
  async getNewsBySlug(slug: string): Promise<{ data: NewsItem }> {
    const response = await this.client.get<{ data: NewsItem }>(
      endpoints.newsBySlug(slug)
    );
    return response.data;
  }

  /** Job listings (public). */
  async getJobs(params?: { status?: 'active' | 'expired' }): Promise<JobListResponse> {
    const response = await this.client.get<JobListResponse>(endpoints.jobs, {
      params,
    });
    return response.data;
  }

  /** Single job by id (public). */
  async getJob(id: number): Promise<{ data: JobListing }> {
    const response = await this.client.get<{ data: JobListing }>(
      endpoints.job(id)
    );
    return response.data;
  }
}

export const apiClient = new ApiClient();
