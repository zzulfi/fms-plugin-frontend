export interface Team {
  id: number;
  name: string;
  Manager: string;
  Colour: string;
}

export interface Participant {
  id: number;
  name: string;
  Skill: string;
  Experience: string;
  Status: string;
  department: string;
}

export interface DraftState {
  // Will be updated based on actual structure
}

export interface RolePlayer {
  id: number;
  name: string;
  accessLevel: string;
  mail: string;
  password: string;
}

export interface WishlistItem {
  // Will be updated based on actual structure
}

export interface UserSession {
  id: number;
  name: string;
  email: string;
  accessLevel: string;
}

export interface LoginResult {
  success: boolean;
  user?: UserSession;
  error?: string;
}

export interface AuthContextType {
  user: UserSession | null;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  isAdmin: () => boolean;
  isTeamLead: () => boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}