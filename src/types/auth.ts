export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'user';
  status: 'pending' | 'active';
  avatar?: string;
  assignedProjects: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  selectedProjectId: string | null;
}