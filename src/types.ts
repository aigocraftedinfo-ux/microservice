export * from '../shared/types.js';

export interface AuthState {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'customer' | 'admin';
    phone?: string;
    address?: any;
  } | null;
  token: string | null;
  isAuthenticated: boolean;
}
