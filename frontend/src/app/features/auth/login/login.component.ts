import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent],
  template: `
    <div class="min-h-[calc(100vh-4rem)] bg-ink-50 bg-grid flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-md">

        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white mx-auto mb-4 shadow-primary">
            <app-icon name="globe" [size]="28" />
          </div>
          <h1 class="text-2xl font-bold text-ink-900 mb-1">Bienvenido de vuelta</h1>
          <p class="text-ink-500">Ingresa para continuar donando</p>
        </div>

        <div class="bg-white rounded-3xl shadow-elevated border border-ink-200 p-8">

          @if (error()) {
            <div class="bg-primary-50 border border-primary-200 text-primary-700 text-sm rounded-xl p-4 mb-5 flex items-start gap-3">
              <app-icon name="alert" [size]="18" class="shrink-0 mt-0.5" />
              <span>{{ error() }}</span>
            </div>
          }

          <form (ngSubmit)="onSubmit()" #f="ngForm" class="space-y-5">
            <div>
              <label class="label">Email</label>
              <input class="input" type="email" name="email" [(ngModel)]="email" required email
                placeholder="tu@email.com" />
            </div>
            <div>
              <label class="label">Contraseña</label>
              <input class="input" type="password" name="password" [(ngModel)]="password" required minlength="6"
                placeholder="••••••••" />
            </div>
            <button type="submit" class="btn-primary w-full py-4 text-base" [disabled]="loading() || f.invalid">
              @if (loading()) {
                Ingresando...
              } @else {
                Ingresar
                <app-icon name="arrow-right" [size]="18" />
              }
            </button>
          </form>

          <div class="mt-6 pt-6 border-t border-ink-100 text-center">
            <p class="text-sm text-ink-600">
              ¿No tienes cuenta?
              <a routerLink="/register" class="link font-bold">Regístrate</a>
            </p>
          </div>
        </div>

        <!-- Demo credentials -->
        <div class="mt-6 bg-white/60 backdrop-blur border border-ink-200 rounded-2xl p-4">
          <p class="text-xs font-bold uppercase tracking-wider text-ink-500 mb-3 text-center">Credenciales demo</p>
          <div class="grid grid-cols-3 gap-2 text-xs">
            <button type="button" (click)="fillDemo('donor')"
              class="bg-ink-50 hover:bg-ink-100 rounded-lg p-2 transition text-left">
              <p class="font-bold text-ink-900 mb-0.5">Donante</p>
              <p class="text-ink-500 truncate">donor&#64;impacto.com</p>
            </button>
            <button type="button" (click)="fillDemo('org')"
              class="bg-ink-50 hover:bg-ink-100 rounded-lg p-2 transition text-left">
              <p class="font-bold text-ink-900 mb-0.5">Org</p>
              <p class="text-ink-500 truncate">medicos&#64;impacto.com</p>
            </button>
            <button type="button" (click)="fillDemo('admin')"
              class="bg-ink-50 hover:bg-ink-100 rounded-lg p-2 transition text-left">
              <p class="font-bold text-ink-900 mb-0.5">Admin</p>
              <p class="text-ink-500 truncate">admin&#64;impacto.com</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  fillDemo(type: 'donor' | 'org' | 'admin') {
    const creds = {
      donor: { email: 'donor@impacto.com', password: 'donor123' },
      org: { email: 'medicos@impacto.com', password: 'org123' },
      admin: { email: 'admin@impacto.com', password: 'admin123' },
    };
    this.email = creds[type].email;
    this.password = creds[type].password;
  }

  onSubmit() {
    this.loading.set(true);
    this.error.set(null);
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/projects']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Error al iniciar sesión');
      },
    });
  }
}