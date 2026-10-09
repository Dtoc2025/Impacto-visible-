import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/project.model';
import { AuthService } from '../../../core/services/auth.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ImageUrlPipe } from '../../../shared/pipes/image-url.pipe';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent, ImageUrlPipe],
  template: `
    @if (loading()) {
      <div class="bg-ink-50 bg-grid min-h-[calc(100vh-4rem)]">
        <div class="max-w-6xl mx-auto px-6 py-12">
          <div class="h-96 skeleton rounded-3xl mb-8"></div>
          <div class="h-8 skeleton w-2/3 mb-4 rounded"></div>
          <div class="h-4 skeleton w-1/3 rounded"></div>
        </div>
      </div>
    } @else if (project()) {
      <div class="bg-ink-50 bg-grid min-h-[calc(100vh-4rem)]">
        <div class="max-w-6xl mx-auto px-6 py-8">

          <a routerLink="/projects" class="inline-flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-ink-900 transition mb-6">
            <app-icon name="arrow-left" [size]="16" />
            Volver a proyectos
          </a>

          <div class="mb-8">
            <div class="relative rounded-3xl overflow-hidden aspect-[16/9] bg-ink-900">
              @if (currentImage()) {
                <img [src]="currentImage() | imageUrl" class="w-full h-full object-cover" [alt]="project()!.title" />
              } @else {
                <div class="w-full h-full bg-gradient-to-br from-primary-100 to-accent-100"></div>
              }

              <div class="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent to-transparent"></div>

              @if (project()!.isForgotten) {
                <span class="absolute top-5 left-5 inline-flex items-center gap-2 bg-primary-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full shadow-elevated">
                  <app-icon name="alert" [size]="14" />
                  Crisis olvidada
                </span>
              }

              <div class="absolute bottom-0 left-0 right-0 p-8">
                <div class="flex items-center gap-3 mb-3">
                  <span class="chip bg-white/95 backdrop-blur" [style.color]="project()!.category.color || '#374151'">
                    {{ project()!.category.name }}
                  </span>
                  <span class="chip backdrop-blur" [ngClass]="urgencyClass(project()!.urgency)">
                    Urgencia {{ urgencyLabel(project()!.urgency) }}
                  </span>
                </div>
                <h1 class="text-3xl md:text-4xl font-extrabold text-white mb-2 text-balance">{{ project()!.title }}</h1>
                <p class="text-ink-200 flex items-center gap-2 text-lg">
                  <app-icon name="map-pin" [size]="18" />
                  {{ project()!.country }}@if (project()!.region) { · {{ project()!.region }} }
                </p>
              </div>
            </div>

            @if (gallery().length > 1) {
              <div class="grid grid-cols-5 md:grid-cols-6 gap-2 mt-3">
                @for (img of gallery(); track img) {
                  <button (click)="currentImage.set(img)"
                    class="relative aspect-square rounded-xl overflow-hidden border-2 transition"
                    [class.border-primary-600]="currentImage() === img"
                    [class.border-transparent]="currentImage() !== img">
                    <img [src]="img | imageUrl" class="w-full h-full object-cover" />
                  </button>
                }
              </div>
            }
          </div>

          <div class="grid lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-6">

              <div class="bg-white rounded-3xl border border-ink-200 p-8 shadow-soft">
                <h2 class="text-xl font-bold mb-4 text-ink-900 flex items-center gap-2">
                  <span class="w-1 h-6 bg-primary-500 rounded"></span>
                  Sobre este proyecto
                </h2>
                <p class="text-ink-700 whitespace-pre-line leading-relaxed">{{ project()!.description }}</p>
              </div>

              @if (project()!.impact) {
                <div class="relative bg-gradient-to-br from-primary-50 to-accent-50 rounded-3xl border border-primary-100 p-8 overflow-hidden">
                  <div class="absolute top-0 right-0 w-48 h-48 bg-primary-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  <div class="relative">
                    <h2 class="text-xl font-bold mb-3 text-ink-900 flex items-center gap-3">
                      <div class="w-10 h-10 rounded-2xl bg-white shadow-soft flex items-center justify-center text-primary-600">
                        <app-icon name="trending-up" [size]="20" />
                      </div>
                      Tu impacto
                    </h2>
                    <p class="text-ink-700 whitespace-pre-line leading-relaxed">{{ project()!.impact }}</p>
                  </div>
                </div>
              }

              @if (project()!.organizer) {
                <div class="bg-white rounded-3xl border border-ink-200 p-8 shadow-soft">
                  <h2 class="text-xl font-bold mb-5 text-ink-900 flex items-center gap-2">
                    <span class="w-1 h-6 bg-secondary-500 rounded"></span>
                    Organización responsable
                  </h2>
                  <div class="flex items-start gap-4">
                    <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-primary">
                      {{ organizerInitials() }}
                    </div>
                    <div class="flex-1">
                      <p class="font-bold text-lg text-ink-900">{{ project()!.organizer!.organizationName || project()!.organizer!.name }}</p>
                      @if (project()!.organizer!.bio) {
                        <p class="text-ink-600 mt-1 leading-relaxed">{{ project()!.organizer!.bio }}</p>
                      }
                      @if (project()!.organizer!.website) {
                        <a [href]="project()!.organizer!.website" target="_blank" class="link text-sm inline-flex items-center gap-1.5 mt-3">
                          <app-icon name="globe" [size]="14" />
                          Visitar sitio web
                        </a>
                      }
                    </div>
                  </div>
                </div>
              }

              @if (project()!.donations && project()!.donations!.length > 0) {
                <div class="bg-white rounded-3xl border border-ink-200 p-8 shadow-soft">
                  <h2 class="text-xl font-bold mb-5 text-ink-900 flex items-center gap-2">
                    <span class="w-1 h-6 bg-accent-500 rounded"></span>
                    Donaciones recientes
                  </h2>
                  <ul class="space-y-4">
                    @for (d of project()!.donations; track d.id) {
                      <li class="flex items-start justify-between gap-4 pb-4 border-b border-ink-100 last:border-0 last:pb-0">
                        <div class="flex items-start gap-3">
                          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-ink-100 to-ink-200 flex items-center justify-center text-ink-600 font-bold shrink-0">
                            {{ d.isAnonymous ? '?' : (d.user?.name?.[0]?.toUpperCase() || '?') }}
                          </div>
                          <div>
                            <p class="font-semibold text-ink-900">{{ d.isAnonymous ? 'Anónimo' : (d.user?.name || 'Donante') }}</p>
                            @if (d.message) {
                              <p class="text-sm text-ink-600 italic mt-0.5">"{{ d.message }}"</p>
                            }
                            <p class="text-xs text-ink-400 mt-1">{{ d.createdAt | date:'short' }}</p>
                          </div>
                        </div>
                        <span class="font-bold text-primary-600 whitespace-nowrap">{{ d.amount | currency:'USD':'symbol':'1.0-0' }}</span>
                      </li>
                    }
                  </ul>
                </div>
              }
            </div>

            <div class="lg:col-span-1">
              <div class="sticky top-24 space-y-4">
                <div class="bg-white rounded-3xl border border-ink-200 p-6 shadow-elevated">
                  <div class="mb-5">
                    <div class="flex items-baseline gap-2 mb-3">
                      <span class="text-3xl font-extrabold text-ink-900">{{ project()!.raised | currency:'USD':'symbol':'1.0-0' }}</span>
                      <span class="text-ink-500 text-sm">de {{ project()!.goal | currency:'USD':'symbol':'1.0-0' }}</span>
                    </div>
                    <div class="w-full bg-ink-100 rounded-full h-3 overflow-hidden mb-2">
                      <div class="bg-gradient-to-r from-primary-500 to-secondary-500 h-full rounded-full transition-all duration-700"
                        [style.width.%]="progress()"></div>
                    </div>
                    <div class="flex justify-between text-xs text-ink-500 font-semibold">
                      <span>{{ progress() | number:'1.0-0' }}% completado</span>
                      <span>{{ project()!.donations?.length || 0 }} donaciones</span>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-3 mb-5">
                    <div class="bg-ink-50 rounded-2xl p-4 text-center">
                      <p class="text-xs font-bold uppercase tracking-wider text-ink-500 mb-1">Beneficiarios</p>
                      <p class="text-xl font-extrabold text-ink-900">{{ beneficiariesDisplay() }}</p>
                    </div>
                    <div class="bg-ink-50 rounded-2xl p-4 text-center">
                      <p class="text-xs font-bold uppercase tracking-wider text-ink-500 mb-1">Urgencia</p>
                      <p class="text-xl font-extrabold text-primary-600">{{ urgencyLabel(project()!.urgency) }}</p>
                    </div>
                  </div>

                  @if (auth.isLoggedIn()) {
                    <a [routerLink]="['/projects', project()!.id, 'donate']" class="btn-primary w-full justify-center text-base py-4">
                      <app-icon name="heart" [size]="20" />
                      Donar ahora
                    </a>
                  } @else {
                    <a routerLink="/login" class="btn-primary w-full justify-center text-base py-4">
                      Inicia sesión para donar
                    </a>
                  }
                </div>

                <div class="bg-white rounded-3xl border border-ink-200 p-6">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 rounded-xl bg-success-50 text-success-600 flex items-center justify-center">
                      <app-icon name="shield" [size]="20" />
                    </div>
                    <p class="font-bold text-ink-900">Donación segura</p>
                  </div>
                  <p class="text-sm text-ink-600">Tus datos están protegidos. 100% de tu donación va al proyecto.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class ProjectDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(ProjectService);
  auth = inject(AuthService);

  project = signal<Project | null>(null);
  loading = signal(true);
  currentImage = signal<string>('');

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getById(id).subscribe({
      next: (p) => {
        this.project.set(p);
        this.currentImage.set(p.imageUrl || (p.gallery && p.gallery[0]) || '');
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  gallery(): string[] {
    const p = this.project();
    if (!p) return [];
    const list: string[] = [];
    if (p.imageUrl) list.push(p.imageUrl);
    if (p.gallery) list.push(...p.gallery.filter(g => g !== p.imageUrl));
    return [...new Set(list)];
  }

  progress() {
    const p = this.project();
    return p ? Math.min(100, (p.raised / p.goal) * 100) : 0;
  }

  urgencyLabel(u: string): string {
    return { CRITICAL: 'Crítica', HIGH: 'Alta', MEDIUM: 'Media', LOW: 'Baja' }[u] || u;
  }

  urgencyClass(u: string): string {
    return {
      CRITICAL: 'bg-primary-600 text-white',
      HIGH: 'bg-orange-100 text-orange-700',
      MEDIUM: 'bg-yellow-100 text-yellow-700',
      LOW: 'bg-green-100 text-green-700',
    }[u] || 'bg-gray-100 text-gray-700';
  }

  organizerInitials(): string {
    const org = this.project()?.organizer;
    if (!org) return '?';
    const name = org.organizationName || org.name;
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  }

  beneficiariesDisplay(): string {
    const b = this.project()?.beneficiaries;
    return b ? b.toLocaleString() : '—';
  }
}