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
  role: string;
  mail: string;
  password: string;
}

export interface WishlistItem {
  id: number;
  team: string;
  participants: Participant[];
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
  team?: string | null;
  avatar?: string | null;
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
  isTeamManager: () => boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ComponentWithActiveTab {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export interface ComponentWithSetActiveTab {
  setActiveTab: (tab: string) => void;
}

export interface LoginFormProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  error: string;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  className?: string;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export interface AdminDashBoardProps {
  setActiveTab: (tab: string) => void;
}

export interface AdminHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export interface TeamDashBoardProps {
  setActiveTab: (tab: string) => void;
}

export interface TeamHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export interface WishListProps {
  setActiveTab: (tab: string) => void;
}

export interface WishlistItem {
  id: number;
  team: string;
  participants: Participant[];
}