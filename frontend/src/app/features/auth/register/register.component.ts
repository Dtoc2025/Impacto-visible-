import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent],
  template: `
    <div class="min-h-[calc(100vh-4rem)] bg-ink-50 bg-grid flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-2xl">

        <div class="text-center mb-8">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white mx-auto mb-4 shadow-primary">
            <app-icon name="globe" [size]="28" />
          </div>
          <h1 class="text-2xl font-bold text-ink-900 mb-1">Crea tu cuenta</h1>
          <p class="text-ink-500">Únete a la comunidad de Impacto Visible</p>
        </div>

        <div class="bg-white rounded-3xl shadow-elevated border border-ink-200 overflow-hidden">

          <!-- Selector de tipo -->
          <div class="grid grid-cols-2 border-b border-ink-100">
            <button type="button" (click)="setRole('DONOR')"
              class="relative py-6 px-4 transition text-left"
              [class.bg-primary-50]="role === 'DONOR'">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  [class.bg-primary-600]="role === 'DONOR'"
                  [class.text-white]="role === 'DONOR'"
                  [class.bg-ink-100]="role !== 'DONOR'"
                  [class.text-ink-500]="role !== 'DONOR'">
                  <app-icon name="heart" [size]="20" />
                </div>
                <div>
                  <p class="font-bold text-ink-900">Donante</p>
                  <p class="text-xs text-ink-500 mt-0.5">Quiero apoyar causas</p>
                </div>
              </div>
              @if (role === 'DONOR') {
                <span class="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary-600"></span>
              }
            </button>

            <button type="button" (click)="setRole('ORG')"
              class="relative py-6 px-4 transition text-left border-l border-ink-100"
              [class.bg-secondary-50]="role === 'ORG'">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  [class.bg-secondary-500]="role === 'ORG'"
                  [class.text-white]="role === 'ORG'"
                  [class.bg-ink-100]="role !== 'ORG'"
                  [class.text-ink-500]="role !== 'ORG'">
                  <app-icon name="building" [size]="20" />
                </div>
                <div>
                  <p class="font-bold text-ink-900">Organización</p>
                  <p class="text-xs text-ink-500 mt-0.5">Quiero publicar proyectos</p>
                </div>
              </div>
              @if (role === 'ORG') {
                <span class="absolute top-3 right-3 w-2 h-2 rounded-full bg-secondary-500"></span>
              }
            </button>
          </div>

          <div class="p-8">

            @if (error()) {
              <div class="bg-primary-50 border border-primary-200 text-primary-700 text-sm rounded-xl p-4 mb-5 flex items-start gap-3">
                <app-icon name="alert" [size]="18" class="shrink-0 mt-0.5" />
                <span>{{ error() }}</span>
              </div>
            }

            <form (ngSubmit)="onSubmit()" #f="ngForm" class="space-y-5">

              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="label">{{ role === 'ORG' ? 'Nombre del responsable' : 'Nombre completo' }}</label>
                  <input class="input" name="name" [(ngModel)]="name" required minlength="2"
                    placeholder="Tu nombre" />
                </div>

                @if (role === 'ORG') {
                  <div>
                    <label class="label">Nombre de la organización <span class="text-primary-600">*</span></label>
                    <input class="input" name="organizationName" [(ngModel)]="organizationName" required minlength="2"
                      placeholder="Ej: Médicos Sin Fronteras" />
                  </div>
                }
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="label">Email</label>
                  <input class="input" type="email" name="email" [(ngModel)]="email" required email
                    placeholder="tu@email.com" />
                </div>
                <div>
                  <label class="label">País</label>
                  <input class="input" name="country" [(ngModel)]="country"
                    placeholder="Ej: México" />
                </div>
              </div>

              @if (role === 'ORG') {
                <div>
                  <label class="label">Sitio web</label>
                  <input class="input" type="url" name="website" [(ngModel)]="website"
                    placeholder="https://..." />
                </div>
                <div>
                  <label class="label">Descripción de la organización</label>
                  <textarea class="input resize-none" name="bio" rows="3" [(ngModel)]="bio"
                    placeholder="¿A qué se dedica tu organización?"></textarea>
                </div>
              }

              <div>
                <label class="label">Contraseña</label>
                <input class="input" type="password" name="password" [(ngModel)]="password" required minlength="6"
                  placeholder="Mínimo 6 caracteres" />
                <p class="text-xs text-ink-500 mt-1.5">Usa una contraseña segura de al menos 6 caracteres</p>
              </div>

              <button type="submit" class="btn-primary w-full py-4 text-base" [disabled]="loading() || f.invalid">
                @if (loading()) {
                  Creando cuenta...
                } @else {
                  Crear mi cuenta
                  <app-icon name="arrow-right" [size]="18" />
                }
              </button>
            </form>

            <div class="mt-6 pt-6 border-t border-ink-100 text-center">
              <p class="text-sm text-ink-600">
                ¿Ya tienes cuenta?
                <a routerLink="/login" class="link font-bold">Inicia sesión</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  role: 'DONOR' | 'ORG' = 'DONOR';
  name = '';
  email = '';
  password = '';
  organizationName = '';
  country = '';
  website = '';
  bio = '';
  loading = signal(false);
  error = signal<string | null>(null);

  setRole(r: 'DONOR' | 'ORG') {
    this.role = r;
  }

  onSubmit() {
    this.loading.set(true);
    this.error.set(null);
    this.auth.register({
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role,
      organizationName: this.role === 'ORG' ? this.organizationName : undefined,
      country: this.country || undefined,
      website: this.website || undefined,
      bio: this.bio || undefined,
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/projects']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Error al registrarse');
      },
    });
  }
}