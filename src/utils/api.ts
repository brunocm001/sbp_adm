const API_BASE_URL = 'https://sbpapi-production.up.railway.app';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface Platform {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  platformId: string;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceType {
  id: string;
  name: string;
  description?: string;
  serviceId?: string;
  platformId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  serviceId: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'support';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sbp_admin_token', token);
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('sbp_admin_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sbp_admin_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication
  async login(email: string, password: string): Promise<ApiResponse<{ token: string; admin: Admin }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout(): Promise<ApiResponse> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Platforms
  async getPlatforms(): Promise<ApiResponse<Platform[]>> {
    return this.request('/platforms');
  }

  async createPlatform(data: Partial<Platform>): Promise<ApiResponse<Platform>> {
    return this.request('/platforms', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePlatform(id: string, data: Partial<Platform>): Promise<ApiResponse<Platform>> {
    return this.request(`/platforms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePlatform(id: string): Promise<ApiResponse> {
    return this.request(`/platforms/${id}`, {
      method: 'DELETE',
    });
  }

  // Services
  async getServices(): Promise<ApiResponse<Service[]>> {
    return this.request('/services');
  }

  async createService(data: Partial<Service>): Promise<ApiResponse<Service>> {
    return this.request('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateService(id: string, data: Partial<Service>): Promise<ApiResponse<Service>> {
    return this.request(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteService(id: string): Promise<ApiResponse> {
    return this.request(`/services/${id}`, {
      method: 'DELETE',
    });
  }

  // Service Types
  async getServiceTypes(): Promise<ApiResponse<ServiceType[]>> {
    return this.request('/service-types');
  }

  async createServiceType(data: Partial<ServiceType>): Promise<ApiResponse<ServiceType>> {
    return this.request('/service-types', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateServiceType(id: string, data: Partial<ServiceType>): Promise<ApiResponse<ServiceType>> {
    return this.request(`/service-types/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteServiceType(id: string): Promise<ApiResponse> {
    return this.request(`/service-types/${id}`, {
      method: 'DELETE',
    });
  }

  // Orders
  async getOrders(page: number = 1, limit: number = 20): Promise<ApiResponse<{ orders: Order[]; total: number; page: number; limit: number }>> {
    return this.request(`/orders?page=${page}&limit=${limit}`);
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<ApiResponse<Order>> {
    return this.request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Payments
  async getPayments(page: number = 1, limit: number = 20): Promise<ApiResponse<{ payments: Payment[]; total: number; page: number; limit: number }>> {
    return this.request(`/payments?page=${page}&limit=${limit}`);
  }

  async getPayment(id: string): Promise<ApiResponse<Payment>> {
    return this.request(`/payments/${id}`);
  }

  // Support Tickets
  async getTickets(page: number = 1, limit: number = 20): Promise<ApiResponse<{ tickets: SupportTicket[]; total: number; page: number; limit: number }>> {
    return this.request(`/tickets?page=${page}&limit=${limit}`);
  }

  async updateTicketStatus(id: string, status: SupportTicket['status']): Promise<ApiResponse<SupportTicket>> {
    return this.request(`/tickets/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async replyToTicket(id: string, message: string): Promise<ApiResponse<SupportTicket>> {
    return this.request(`/tickets/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // Admins
  async getAdmins(): Promise<ApiResponse<Admin[]>> {
    return this.request('/admins');
  }

  async createAdmin(data: Partial<Admin>): Promise<ApiResponse<Admin>> {
    return this.request('/admins', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAdmin(id: string, data: Partial<Admin>): Promise<ApiResponse<Admin>> {
    return this.request(`/admins/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAdmin(id: string): Promise<ApiResponse> {
    return this.request(`/admins/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL); 