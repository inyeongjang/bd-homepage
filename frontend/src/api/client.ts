/**
 * API Client for Backend Communication
 * - Dev: use Vite proxy (baseUrl = '')
 * - Prod: set VITE_API_BASE_URL (e.g. https://api.example.com)
 */

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || '';

/* =====================
 * Utils (normalize helpers)
 * ===================== */

const toNumberOr = (value: any, fallback: number) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const toBooleanOr = (value: any, fallback: boolean) => {
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return fallback;
};

/* FAQ는 DB 제약이 빡세므로 확실히 보정 */
const normalizeFaqPayload = (payload: any) => ({
  question: payload?.question ?? '',
  answer: payload?.answer ?? '',
  isActive: toBooleanOr(payload?.isActive, true),
  orderIndex: toNumberOr(payload?.orderIndex, 0),
});

/* Activity 계열 공통 */
const normalizeActivityPayload = (payload: any) => ({
  ...payload,
  year: toNumberOr(payload?.year, new Date().getFullYear()),
  orderIndex: toNumberOr(payload?.orderIndex, 0),
  isActive: toBooleanOr(payload?.isActive, true),
  iconUrl: payload?.iconUrl ?? null,
});

/* Winners */
const normalizeWinnerNamePayload = (payload: any) => ({
  name: payload?.name ?? '',
  orderIndex: toNumberOr(payload?.orderIndex, 0),
  isActive: toBooleanOr(payload?.isActive, true),
});

/* Recruitment */
const normalizeRecruitmentPayload = (payload: any) => ({
  ...payload,
  isActive: toBooleanOr(payload?.isActive, true),
});

/* =====================
 * API Client
 * ===================== */

class ApiClient {
  private baseUrl: string;
  private accessToken: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(this.accessToken
            ? { Authorization: `Bearer ${this.accessToken}` }
            : {}),
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(
          `HTTP ${response.status}: ${response.statusText}${text ? ` - ${text}` : ''}`
        );
      }

      if (response.status === 204) {
        return undefined as T;
      }

      const text = await response.text().catch(() => '');
      if (!text) {
        return undefined as T;
      }
      return JSON.parse(text) as T;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  /* =====================
   * Public endpoints
   * ===================== */

  async getActivities() {
    return this.request<any[]>('/api/activities');
  }

  async getActivityCategories() {
    return this.request<any[]>('/api/activity-categories');
  }

  async getActivityByYear(year: string) {
    return this.request<any[]>(`/api/activities?year=${year}`);
  }

  async getFaqs() {
    return this.request<any[]>('/api/faqs');
  }

  async getRecruitInfo() {
    return this.request<any>('/api/recruit');
  }

  /* =====================
   * Admin auth
   * ===================== */

  async loginAdmin(password: string) {
    return this.request<{ accessToken: string; expiresIn: number }>(
      '/api/admin/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ password }),
      }
    );
  }

  /* =====================
   * Admin activity
   * ===================== */

  async getAdminActivities(year: number, category: string) {
    return this.request<any[]>(
      `/api/admin/activity-items?year=${year}&category=${encodeURIComponent(category)}`
    );
  }

  async createAdminActivity(payload: any) {
    return this.request<any>('/api/admin/activity-items', {
      method: 'POST',
      body: JSON.stringify(normalizeActivityPayload(payload)),
    });
  }

  async updateAdminActivity(id: number, payload: any) {
    return this.request<any>(`/api/admin/activity-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(normalizeActivityPayload(payload)),
    });
  }

  async deleteAdminActivity(id: number) {
    return this.request<void>(`/api/admin/activity-items/${id}`, {
      method: 'DELETE',
    });
  }

  /* =====================
   * Admin FAQ  ✅ 완전 보정
   * ===================== */

  async getAdminFaqs() {
    return this.request<any[]>('/api/admin/faqs');
  }

  async createAdminFaq(payload: any) {
    return this.request<any>('/api/admin/faqs', {
      method: 'POST',
      body: JSON.stringify(normalizeFaqPayload(payload)),
    });
  }

  async updateAdminFaq(id: string, payload: any) {
    return this.request<any>(`/api/admin/faqs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(normalizeFaqPayload(payload)),
    });
  }

  async deleteAdminFaq(id: string) {
    return this.request<void>(`/api/admin/faqs/${id}`, {
      method: 'DELETE',
    });
  }

  /* =====================
   * Admin recruitment
   * ===================== */

  async getAdminRecruitment() {
    return this.request<any>('/api/admin/recruitment');
  }

  async updateAdminRecruitment(payload: any) {
    return this.request<void>('/api/admin/recruitment', {
      method: 'PUT',
      body: JSON.stringify(normalizeRecruitmentPayload(payload)),
    });
  }

  /* =====================
   * Admin winners
   * ===================== */

  async getAdminWinners() {
    return this.request<any>('/api/admin/winners');
  }

  async updateAdminWinnersSettings(payload: any) {
    return this.request<void>('/api/admin/winners/settings', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async createAdminWinnerName(payload: any) {
    return this.request<any>('/api/admin/winners/names', {
      method: 'POST',
      body: JSON.stringify(normalizeWinnerNamePayload(payload)),
    });
  }

  async updateAdminWinnerName(id: string, payload: any) {
    return this.request<any>(`/api/admin/winners/names/${id}`, {
      method: 'PUT',
      body: JSON.stringify(normalizeWinnerNamePayload(payload)),
    });
  }

  async deleteAdminWinnerName(id: string) {
    return this.request<void>(`/api/admin/winners/names/${id}`, {
      method: 'DELETE',
    });
  }

  /* =====================
   * Health check
   * ===================== */

  async healthCheck() {
    return this.request<{ status: string }>('/api/health');
  }
}

export const apiClient = new ApiClient();
export default apiClient;
