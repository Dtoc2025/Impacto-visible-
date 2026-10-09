export type Role = 'ADMIN' | 'ORG' | 'DONOR';

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
  organizationName?: string;
  country?: string;
  avatarUrl?: string;
  website?: string;
  bio?: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}