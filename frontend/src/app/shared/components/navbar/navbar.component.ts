import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, IconComponent],
  template: `
    <nav class="bg-white/85 backdrop-blur-xl border-b border-ink-200/70 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">

        <a routerLink="/" class="flex items-center gap-2.5 font-extrabold text-ink-900 text-lg group">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white shadow-primary group-hover:scale-105 transition-transform">
            <app-icon name="globe" [size]="20" />
          </div>
          <span class="hidden sm:inline tracking-tight">
            Impacto<span class="text-primary-600">Visible</span>
          </span>
        </a>

        <div class="hidden md:flex items-center gap-1">
          <a routerLink="/projects" routerLinkActive="bg-ink-100 text-primary-600"
            [routerLinkActiveOptions]="{ exact: false }"
            class="px-4 py-2 rounded-lg text-sm font-semibold text-ink-600 hover:bg-ink-100 hover:text-ink-900 transition">
            Proyectos
          </a>
          <a routerLink="/dashboard" routerLinkActive="bg-ink-100 text-primary-600"
            class="px-4 py-2 rounded-lg text-sm font-semibold text-ink-600 hover:bg-ink-100 hover:text-ink-900 transition">
            Dashboard
          </a>
          @if (auth.isLoggedIn()) {
            @if (auth.canManageProjects()) {
              <a routerLink="/manage/projects" routerLinkActive="bg-ink-100 text-primary-600"
                class="px-4 py-2 rounded-lg text-sm font-semibold text-ink-600 hover:bg-ink-100 hover:text-ink-900 transition">
                Mis proyectos
              </a>
            }
            <a routerLink="/my-donations" routerLinkActive="bg-ink-100 text-primary-600"
              class="px-4 py-2 rounded-lg text-sm font-semibold text-ink-600 hover:bg-ink-100 hover:text-ink-900 transition">
              Mis donaciones
            </a>
          }
        </div>

        <div class="flex items-center gap-3">
          @if (auth.isLoggedIn()) {
            <div class="relative">
              <button (click)="toggleMenu()"
                class="flex items-center gap-2 hover:bg-ink-100 pl-1 pr-3 py-1 rounded-full transition">
                @if (auth.currentUser()?.avatarUrl) {
                  <img [src]="auth.currentUser()!.avatarUrl" class="w-8 h-8 rounded-full object-cover ring-2 ring-primary-200" />
                } @else {
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white flex items-center justify-center font-bold text-xs ring-2 ring-primary-200">
                    {{ initials() }}
                  </div>
                }
                <span class="hidden md:inline text-sm font-semibold text-ink-700">{{ displayName() }}</span>
                <app-icon name="chevron-down" [size]="14" class="text-ink-400" />
              </button>

              @if (menuOpen()) {
                <div class="absolute right-0 mt-2 w-64 bg-white border border-ink-200 rounded-2xl shadow-elevated overflow-hidden z-50 animate-slide-up">
                  <div class="px-5 py-4 bg-gradient-to-br from-primary-50 to-secondary-50 border-b border-ink-100">
                    <p class="text-sm font-bold text-ink-900 truncate">{{ auth.currentUser()?.name }}</p>
                    <p class="text-xs text-ink-500 truncate">{{ auth.currentUser()?.email }}</p>
                    <span class="inline-block mt-2 text-[10px] font-bold uppercase tracking-widest bg-white text-primary-700 px-2 py-0.5 rounded-full border border-primary-200">
                      {{ roleLabel() }}
                    </span>
                  </div>
                  <div class="py-2">
                    <a routerLink="/profile" (click)="closeMenu()" class="flex items-center gap-3 px-5 py-2.5 text-sm text-ink-700 hover:bg-ink-50 transition">
                      <app-icon name="user" [size]="16" /> Mi perfil
                    </a>
                    @if (auth.canManageProjects()) {
                      <a routerLink="/manage/projects" (click)="closeMenu()" class="flex items-center gap-3 px-5 py-2.5 text-sm text-ink-700 hover:bg-ink-50 transition">
                        <app-icon name="bar-chart" [size]="16" /> Mis proyectos
                      </a>
                      <a routerLink="/manage/projects/new" (click)="closeMenu()" class="flex items-center gap-3 px-5 py-2.5 text-sm text-ink-700 hover:bg-ink-50 transition">
                        <app-icon name="plus" [size]="16" /> Crear proyecto
                      </a>
                    }
                    <a routerLink="/my-donations" (click)="closeMenu()" class="flex items-center gap-3 px-5 py-2.5 text-sm text-ink-700 hover:bg-ink-50 transition">
                      <app-icon name="heart" [size]="16" /> Mis donaciones
                    </a>
                  </div>
                  <div class="border-t border-ink-100">
                    <button (click)="logout()" class="w-full flex items-center gap-3 px-5 py-3 text-sm text-primary-600 hover:bg-primary-50 transition font-medium">
                      <app-icon name="log-out" [size]="16" /> Cerrar sesión
                    </button>
                  </div>
                </div>
              }
            </div>
          } @else {
            <a routerLink="/login" class="hidden md:inline text-sm font-semibold text-ink-700 hover:text-primary-600 px-3 py-2 transition">
              Ingresar
            </a>
            <a routerLink="/register" class="btn-primary text-sm py-2 px-5">
              Registrarse
            </a>
          }
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  auth = inject(AuthService);
  menuOpen = signal(false);

  toggleMenu() { this.menuOpen.update(v => !v); }
  closeMenu() { this.menuOpen.set(false); }

  logout() {
    this.closeMenu();
    this.auth.logout();
  }

  displayName(): string {
    const user = this.auth.currentUser();
    if (!user) return '';
    return user.role === 'ORG' ? (user.organizationName || user.name) : user.name;
  }

  initials(): string {
    const name = this.displayName();
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  }

  roleLabel(): string {
    const role = this.auth.currentUser()?.role;
    if (role === 'ADMIN') return 'Administrador';
    if (role === 'ORG') return 'Organización';
    return 'Donante';
  }
}