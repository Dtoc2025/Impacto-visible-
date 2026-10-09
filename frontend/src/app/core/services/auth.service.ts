import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthResponse, Role, User } from '../models/user.model';

const TOKEN_KEY = 'impacto_token';
const USER_KEY = 'impacto_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<User | null>(this.loadUser());

  constructor(private api: ApiService, private router: Router) {}

  register(data: {
    email: string;
    name: string;
    password: string;
    role: 'DONOR' | 'ORG';
    organizationName?: string;
    country?: string;
    website?: string;
    bio?: string;
  }) {
    return this.api.post<AuthResponse>('/auth/register', data).pipe(
      tap((res) => this.setSession(res))
    );
  }

  login(data: { email: string; password: string }) {
    return this.api.post<AuthResponse>('/auth/login', data).pipe(
      tap((res) => this.setSession(res))
    );
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  updateProfile(data: Partial<User>) {
    return this.api.put<User>('/auth/me', data).pipe(
      tap((user) => {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        this.currentUser.set(user);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  hasRole(role: Role): boolean {
    return this.currentUser()?.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  isOrg(): boolean {
    return this.hasRole('ORG');
  }

  isDonor(): boolean {
    return this.hasRole('DONOR');
  }

  canManageProjects(): boolean {
    return this.isAdmin() || this.isOrg();
  }

  private setSession(res: AuthResponse) {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    this.currentUser.set(res.user);
  }

  private loadUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}