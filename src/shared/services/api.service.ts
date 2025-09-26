import { envConfig } from '../../app/config/env.config';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = envConfig.API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}/api${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData
        );
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return response as unknown as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error occurred',
        0
      );
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // Authentication methods
  async login(email: string, password: string): Promise<any> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(userData: {
    email: string;
    password: string;
    displayName: string;
    phoneNumber?: string;
    role?: string;
    team?: string;
  }): Promise<any> {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile(): Promise<any> {
    const token = localStorage.getItem('token');
    return this.request('/auth/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async getPermissions(): Promise<any> {
    const token = localStorage.getItem('token');
    return this.request('/auth/permissions', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Team Management
  async getTeams(): Promise<any> {
    return this.get('/teams');
  }

  async getTeamById(id: string): Promise<any> {
    return this.get(`/teams/${id}`);
  }

  async createTeam(team: { name: string; logoUrl?: string; colorCode?: string }): Promise<any> {
    return this.post('/teams', team);
  }

  async updateTeam(id: string, team: { name?: string; logoUrl?: string; colorCode?: string }): Promise<any> {
    return this.patch(`/teams/${id}`, team);
  }

  async deleteTeam(id: string): Promise<any> {
    return this.delete(`/teams/${id}`);
  }

  // Participant Management
  async getParticipants(sectionId?: string): Promise<any> {
    const endpoint = sectionId ? `/participants?section=${sectionId}` : '/participants';
    return this.get(endpoint);
  }

  async getParticipantById(id: string): Promise<any> {
    return this.get(`/participants/${id}`);
  }

  async createParticipant(participant: {
    name: string;
    email: string;
    phone?: string;
    dob: string;
    gender: 'MALE' | 'FEMALE';
    section: string;
    group?: string;
    admNo?: string;
    chestNo?: string;
    avatar?: string;
    achievements?: string[];
    skills?: string[];
    isActive?: boolean;
  }): Promise<any> {
    return this.post('/participants', participant);
  }

  async updateParticipant(id: string, participant: any): Promise<any> {
    return this.patch(`/participants/${id}`, participant);
  }

  async deleteParticipant(id: string): Promise<any> {
    return this.delete(`/participants/${id}`);
  }

  async bulkCreateParticipants(participants: any[]): Promise<any> {
    return this.post('/participants/bulk', participants);
  }

  // Section Management
  async getSections(): Promise<any> {
    return this.get('/sections');
  }

  async createSection(section: { name: string }): Promise<any> {
    return this.post('/sections', section);
  }

  async updateSection(id: string, section: { name: string }): Promise<any> {
    return this.patch(`/sections/${id}`, section);
  }

  async deleteSection(id: string): Promise<any> {
    return this.delete(`/sections/${id}`);
  }

  // Group Management
  async getGroups(sectionId?: string): Promise<any> {
    const endpoint = sectionId ? `/groups?section=${sectionId}` : '/groups';
    return this.get(endpoint);
  }

  async createGroup(group: { name: string; section: string }): Promise<any> {
    return this.post('/groups', group);
  }

  async updateGroup(id: string, group: { name?: string }): Promise<any> {
    return this.patch(`/groups/${id}`, group);
  }

  async deleteGroup(id: string): Promise<any> {
    return this.delete(`/groups/${id}`);
  }

  // Auction Management
  async getAuctions(): Promise<any> {
    return this.get('/auctions');
  }

  async getAuctionById(id: string): Promise<any> {
    return this.get(`/auctions/${id}`);
  }

  async createAuction(auction: {
    name: string;
    description?: string;
    section: string;
    timer?: number;
    extraTime?: number;
    firstTeamsOrder: string[];
  }): Promise<any> {
    return this.post('/auctions', auction);
  }

  async updateAuction(id: string, auction: any): Promise<any> {
    return this.patch(`/auctions/${id}`, auction);
  }

  async startAuction(id: string, accessCode: string): Promise<any> {
    return this.post(`/auctions/${id}/start`, { accessCode });
  }

  async endAuction(id: string, accessCode: string): Promise<any> {
    return this.post(`/auctions/${id}/end`, { accessCode });
  }

  async verifyAccessCode(id: string, accessCode: string): Promise<any> {
    return this.post(`/auctions/${id}/verify-access`, { accessCode });
  }

  async updateTeamWithAuction(id: string): Promise<any> {
    return this.post(`/auctions/${id}/update-team-with-auction`);
  }

  // Set authorization header for authenticated requests
  setAuthToken(token: string): void {
    this.authToken = token;
  }

  private authToken: string | null = null;

  private getAuthHeaders(): Record<string, string> {
    const token = this.authToken || localStorage.getItem('token');
    if (token) {
      return {
        'Authorization': `Bearer ${token}`,
      };
    }
    return {};
  }
}

export const apiService = new ApiService();