import { HttpService } from '../../../shared/services/base/http.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  displayName: string;
  phoneNumber?: string;
  role?: string;
  team?: string;
}

export interface AuthResponse {
  user: {
    uid: string;
    email: string;
    displayName: string;
    phoneNumber?: string;
    photoURL?: string;
    role: string;
    team?: {
      _id: string;
      name: string;
    };
    createdAt: string;
  };
  token: string;
}

export interface UserPermissions {
  canCreateAuction: boolean;
  canStartAuction: boolean;
  canEndAuction: boolean;
  canManageUsers: boolean;
  canAssignRoles: boolean;
}

class AuthService extends HttpService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.post('/auth/login', credentials);
  }

  async signup(userData: SignupRequest): Promise<AuthResponse> {
    return this.post('/auth/signup', userData);
  }

  async getProfile(): Promise<AuthResponse['user']> {
    return this.get('/auth/profile');
  }

  async getPermissions(): Promise<UserPermissions> {
    return this.get('/auth/permissions');
  }

  async updateUserRole(userId: string, role: string): Promise<void> {
    return this.patch(`/auth/users/${userId}/role`, { role });
  }
}

export const authService = new AuthService();