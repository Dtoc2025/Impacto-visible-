import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UploadService } from '../../core/services/upload.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ImageUrlPipe } from '../../shared/pipes/image-url.pipe';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, ImageUrlPipe],
  template: `
    <div class="bg-ink-50 bg-grid min-h-[calc(100vh-4rem)]">
      <div class="max-w-3xl mx-auto px-6 py-12">

        <div class="mb-10">
          <p class="eyebrow">Tu cuenta</p>
          <h1 class="section-title mb-2">Mi perfil</h1>
          <p class="text-lg text-ink-600">Gestiona tu información personal</p>
        </div>

        @if (success()) {
          <div class="bg-success-50 border border-success-500/30 text-success-700 text-sm rounded-2xl p-4 mb-6 flex items-center gap-3 animate-fade-in">
            <app-icon name="check" [size]="20" />
            <span class="font-medium">Perfil actualizado correctamente</span>
          </div>
        }
        @if (error()) {
          <div class="bg-primary-50 border border-primary-200 text-primary-700 text-sm rounded-2xl p-4 mb-6 flex items-start gap-3">
            <app-icon name="alert" [size]="20" class="shrink-0 mt-0.5" />
            <span>{{ error() }}</span>
          </div>
        }

        <div class="bg-white rounded-3xl border border-ink-200 shadow-soft overflow-hidden">
          <div class="h-3 bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500"></div>

          <div class="p-8 border-b border-ink-100">
            <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div class="relative shrink-0">
                @if (avatarPreview() && avatarPreview() !== '') {
                  <img [src]="avatarPreview() | imageUrl"
                    class="w-24 h-24 rounded-full object-cover ring-4 ring-primary-50 shadow-elevated"
                    (error)="avatarPreview.set('')" />
                } @else {
                  <div class="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white flex items-center justify-center font-extrabold text-3xl ring-4 ring-primary-50 shadow-elevated">
                    {{ initials() || '?' }}
                  </div>
                }
                <label class="absolute bottom-0 right-0 w-8 h-8 bg-white border-2 border-ink-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-ink-50 hover:border-primary-300 transition shadow-md">
                  <app-icon name="upload" [size]="14" class="text-ink-700" />
                  <input type="file" accept="image/*" (change)="onAvatarSelected($event)" class="hidden" />
                </label>
              </div>

              <div class="flex-1 text-center sm:text-left min-w-0">
                <h2 class="text-2xl font-bold text-ink-900 truncate">{{ user()?.name }}</h2>
                <p class="text-ink-500 text-sm mt-1 truncate">{{ user()?.email }}</p>
                <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                  <span class="text-[10px] font-bold uppercase tracking-widest bg-primary-100 text-primary-700 px-3 py-1 rounded-full">
                    {{ roleLabel() }}
                  </span>
                  @if (user()?.country) {
                    <span class="text-[10px] font-bold uppercase tracking-widest bg-ink-100 text-ink-600 px-3 py-1 rounded-full flex items-center gap-1">
                      <app-icon name="map-pin" [size]="10" />
                      {{ user()?.country }}
                    </span>
                  }
                </div>
              </div>
            </div>
          </div>

          <form (ngSubmit)="save()" class="p-8 space-y-6">
            <div>
              <h3 class="text-xs font-bold uppercase tracking-[0.15em] text-ink-500 mb-4">Información personal</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="label">Nombre</label>
                  <input class="input" name="name" [(ngModel)]="form.name" required minlength="2" />
                </div>
                <div>
                  <label class="label">País</label>
                  <input class="input" name="country" [(ngModel)]="form.country" placeholder="Ej: Guatemala" />
                </div>
              </div>
            </div>

            @if (isOrg()) {
              <div class="pt-6 border-t border-ink-100">
                <h3 class="text-xs font-bold uppercase tracking-[0.15em] text-ink-500 mb-4">Información de la organización</h3>
                <div class="space-y-5">
                  <div>
                    <label class="label">Nombre de la organización</label>
                    <input class="input" name="organizationName" [(ngModel)]="form.organizationName" />
                  </div>
                  <div>
                    <label class="label">Sitio web</label>
                    <input class="input" type="url" name="website" [(ngModel)]="form.website"
                      placeholder="https://..." />
                  </div>
                  <div>
                    <label class="label">Descripción</label>
                    <textarea class="input resize-none" name="bio" rows="4" [(ngModel)]="form.bio"
                      placeholder="Cuéntanos sobre tu organización..."></textarea>
                  </div>
                </div>
              </div>
            }

            <div class="pt-4 border-t border-ink-100">
              <button type="submit" class="btn-primary w-full py-4" [disabled]="loading()">
                @if (loading()) {
                  Guardando...
                } @else {
                  <app-icon name="check" [size]="18" />
                  Guardar cambios
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  private auth = inject(AuthService);
  private uploadService = inject(UploadService);

  user = this.auth.currentUser;
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);
  avatarPreview = signal<string>('');

  form: any = {
    name: '',
    organizationName: '',
    country: '',
    website: '',
    bio: '',
    avatarUrl: '',
  };

  ngOnInit() {
    const u = this.user();
    if (u) {
      this.form = {
        name: u.name || '',
        organizationName: u.organizationName || '',
        country: u.country || '',
        website: u.website || '',
        bio: u.bio || '',
        avatarUrl: u.avatarUrl || '',
      };
      this.avatarPreview.set(u.avatarUrl || '');
    }
  }

  onAvatarSelected(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;
    this.uploadService.uploadSingle(file).subscribe({
      next: (res) => {
        this.form.avatarUrl = res.url;
        this.avatarPreview.set(res.url);
      },
      error: () => this.error.set('Error al subir la imagen'),
    });
  }

  save() {
    this.loading.set(true);
    this.error.set(null);
    this.success.set(false);
    this.auth.updateProfile(this.form).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
        setTimeout(() => this.success.set(false), 3000);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Error al guardar');
      },
    });
  }

  initials(): string {
    const name = this.user()?.name || '';
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  }

  roleLabel(): string {
    const role = this.user()?.role;
    if (role === 'ADMIN') return 'Administrador';
    if (role === 'ORG') return 'Organización';
    return 'Donante';
  }

  isOrg(): boolean {
    return this.user()?.role === 'ORG';
  }
}