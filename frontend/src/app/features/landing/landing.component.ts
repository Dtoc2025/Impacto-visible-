import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { DashboardService, DashboardStats } from '../../core/services/dashboard.service';
import { Project } from '../../core/models/project.model';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { ImageUrlPipe } from '../../shared/pipes/image-url.pipe';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent, ImageUrlPipe],
  template: `
    <!-- HERO -->
    <section class="relative overflow-hidden bg-white">
      <div class="absolute inset-0 bg-mesh-primary pointer-events-none"></div>
      <div class="absolute inset-0 bg-grid opacity-30 pointer-events-none"></div>

      <div class="relative max-w-7xl mx-auto px-6 py-20 md:py-32 grid lg:grid-cols-12 gap-12 items-center">
        <div class="lg:col-span-7 animate-fade-in-up">
          <div class="inline-flex items-center gap-2 bg-white border border-ink-200 rounded-full px-4 py-2 mb-6 shadow-soft">
            <span class="w-2 h-2 bg-success-500 rounded-full animate-pulse-slow"></span>
            <span class="text-xs font-semibold text-ink-700 uppercase tracking-wider">Ayuda verificada · En vivo</span>
          </div>

          <h1 class="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.02] mb-6 text-ink-900 text-balance">
            Tu donación<br>
            <span class="bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 bg-clip-text text-transparent">cambia vidas</span>
            <span class="block text-3xl md:text-4xl lg:text-5xl mt-4 text-ink-500 font-bold">en crisis olvidadas</span>
          </h1>

          <p class="text-lg md:text-xl text-ink-600 mb-10 max-w-xl leading-relaxed">
            Conectamos donantes con proyectos humanitarios verificados en todo el mundo, dando visibilidad especial a las causas que el mundo ha dejado de mirar.
          </p>

          <div class="flex flex-wrap gap-3 mb-10">
            <a routerLink="/projects" class="btn-primary text-base px-8 py-4">
              Explorar proyectos
              <app-icon name="arrow-right" [size]="18" />
            </a>
            <a routerLink="/register" class="btn-secondary text-base px-8 py-4">
              Crear cuenta gratis
            </a>
          </div>

          <div class="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ink-500">
            <div class="flex items-center gap-2">
              <app-icon name="shield" [size]="18" class="text-success-600" />
              <span>Donación 100% segura</span>
            </div>
            <div class="flex items-center gap-2">
              <app-icon name="check" [size]="18" class="text-success-600" />
              <span>Proyectos verificados</span>
            </div>
            <div class="flex items-center gap-2">
              <app-icon name="trending-up" [size]="18" class="text-success-600" />
              <span>Métricas en vivo</span>
            </div>
          </div>
        </div>

        <div class="lg:col-span-5 relative">
          <div class="grid grid-cols-2 gap-4 animate-scale-in">
            @for (s of statsCards(); track s.label; let i = $index) {
              <div class="bg-white rounded-2xl shadow-elevated border border-ink-100 p-6"
                [style.marginTop]="i % 2 === 1 ? '2rem' : '0'"
                [class.animate-float]="i === 1">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  [style.background-color]="s.bg" [style.color]="s.color">
                  <app-icon [name]="s.icon" [size]="20" />
                </div>
                <p class="text-3xl font-extrabold text-ink-900 mb-1">{{ s.value }}</p>
                <p class="text-xs font-semibold text-ink-500 uppercase tracking-wider">{{ s.label }}</p>
              </div>
            }
          </div>
        </div>
      </div>
    </section>

    <!-- BANNER CRISIS OLVIDADAS -->
    <section class="max-w-7xl mx-auto px-6 py-8">
      <div class="relative bg-ink-900 rounded-3xl p-8 md:p-12 overflow-hidden animate-fade-in">
        <div class="absolute inset-0 bg-mesh-dark"></div>
        <div class="absolute top-0 right-0 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl"></div>

        <div class="relative flex flex-wrap items-center justify-between gap-8">
          <div class="max-w-2xl">
            <div class="inline-flex items-center gap-2 bg-primary-500/20 backdrop-blur border border-primary-500/30 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-300 mb-4">
              <app-icon name="alert" [size]="14" />
              Atención urgente
            </div>
            <h2 class="text-3xl md:text-4xl font-extrabold mb-3 text-white">Crisis olvidadas</h2>
            <p class="text-ink-300 text-lg leading-relaxed">
              Proyectos que no reciben cobertura mediática pero que salvan vidas cada día. Aquí tu ayuda tiene el mayor impacto.
            </p>
          </div>
          <a routerLink="/projects" [queryParams]="{ forgotten: true }"
            class="inline-flex items-center gap-2 bg-white text-ink-900 hover:bg-ink-100 font-bold py-4 px-8 rounded-xl transition shadow-elevated">
            Ver crisis olvidadas
            <app-icon name="arrow-right" [size]="18" />
          </a>
        </div>
      </div>
    </section>

    <!-- CÓMO FUNCIONA -->
    <section class="max-w-7xl mx-auto px-6 py-24">
      <div class="text-center mb-16">
        <p class="eyebrow">Simple y transparente</p>
        <h2 class="section-title mb-4">¿Cómo funciona?</h2>
        <p class="text-lg text-ink-600 max-w-2xl mx-auto">Donar nunca fue tan fácil. En 3 pasos apoyas causas reales alrededor del mundo.</p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        @for (step of steps; track step.title; let i = $index) {
          <article class="relative bg-white rounded-3xl p-8 border border-ink-200 shadow-soft hover:shadow-elevated transition-all duration-300 animate-fade-in-up"
            [style.animationDelay]="(i * 100) + 'ms'">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white flex items-center justify-center shadow-primary mb-6">
              <app-icon [name]="step.icon" [size]="26" />
            </div>
            <span class="absolute top-8 right-8 text-5xl font-extrabold text-ink-100">0{{ i + 1 }}</span>
            <h3 class="text-xl font-bold mb-3 text-ink-900 relative">{{ step.title }}</h3>
            <p class="text-ink-600 leading-relaxed relative">{{ step.description }}</p>
          </article>
        }
      </div>
    </section>

    <!-- PROYECTOS DESTACADOS -->
    <section class="bg-white py-24 border-y border-ink-200">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <p class="eyebrow">Causas activas</p>
            <h2 class="section-title mb-2">Proyectos destacados</h2>
            <p class="text-lg text-ink-600">Ayuda donde más se necesita ahora</p>
          </div>
          <a routerLink="/projects" class="btn-secondary hidden md:inline-flex">
            Ver todos
            <app-icon name="arrow-right" [size]="16" />
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (p of featured(); track p.id) {
            <a [routerLink]="['/projects', p.id]"
              class="group bg-white rounded-3xl border border-ink-200 overflow-hidden hover:shadow-elevated hover:-translate-y-2 transition-all duration-500 flex flex-col">

              <div class="relative aspect-[16/10] overflow-hidden bg-ink-100">
                @if (p.imageUrl) {
                  <img [src]="p.imageUrl | imageUrl" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" [alt]="p.title" />
                } @else {
                  <div class="w-full h-full bg-gradient-to-br from-primary-100 via-accent-100 to-secondary-100"></div>
                }
                <div class="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-transparent to-transparent"></div>

                @if (p.isForgotten) {
                  <span class="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-primary-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg">
                    <app-icon name="alert" [size]="12" />
                    Crisis olvidada
                  </span>
                }

                <span class="absolute bottom-4 left-4 text-white text-sm font-bold">
                  {{ p.category.name }}
                </span>
              </div>

              <div class="p-6 flex-1 flex flex-col">
                <h3 class="font-bold text-lg mb-2 group-hover:text-primary-600 transition line-clamp-2 text-ink-900 leading-snug">{{ p.title }}</h3>

                <div class="flex items-center gap-2 text-sm text-ink-500 mb-4">
                  <app-icon name="map-pin" [size]="14" />
                  <span>{{ p.country }}</span>
                </div>

                <div class="mt-auto pt-4 border-t border-ink-100">
                  <div class="flex justify-between text-sm mb-2">
                    <span class="font-bold text-primary-600">{{ p.raised | currency:'USD':'symbol':'1.0-0' }}</span>
                    <span class="text-ink-500">de {{ p.goal | currency:'USD':'symbol':'1.0-0' }}</span>
                  </div>
                  <div class="w-full bg-ink-100 rounded-full h-2 overflow-hidden mb-2">
                    <div class="bg-gradient-to-r from-primary-500 to-secondary-500 h-full rounded-full transition-all duration-700"
                      [style.width.%]="progress(p)"></div>
                  </div>
                  <div class="flex justify-between text-xs text-ink-500 font-medium">
                    <span>{{ progress(p) | number:'1.0-0' }}% completado</span>
                    @if (p.beneficiaries) {
                      <span class="inline-flex items-center gap-1">
                        <app-icon name="users" [size]="12" />
                        {{ p.beneficiaries | number }}
                      </span>
                    }
                  </div>
                </div>
              </div>
            </a>
          }
        </div>

        <div class="text-center mt-10 md:hidden">
          <a routerLink="/projects" class="btn-primary">Ver todos los proyectos</a>
        </div>
      </div>
    </section>

    <!-- CTA ORGANIZACIONES -->
    <section class="max-w-7xl mx-auto px-6 py-24">
      <div class="relative bg-ink-900 rounded-3xl p-10 md:p-16 overflow-hidden">
        <div class="absolute inset-0 bg-mesh-dark"></div>
        <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary-500/20 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-3xl"></div>

        <div class="relative grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div class="inline-flex items-center gap-2 bg-secondary-500/20 backdrop-blur border border-secondary-500/30 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider text-secondary-300 mb-5">
              <app-icon name="building" [size]="14" />
              Para organizaciones
            </div>
            <h2 class="text-3xl md:text-5xl font-extrabold mb-5 text-white text-balance leading-tight">
              ¿Tienes una causa que necesita ayuda?
            </h2>
            <p class="text-lg text-ink-300 mb-8 max-w-lg leading-relaxed">
              Publica tus proyectos, sube fotos y llega a miles de donantes. Únete gratis y empieza a recibir apoyo hoy mismo.
            </p>
            <a routerLink="/register" class="inline-flex items-center gap-2 bg-white text-ink-900 hover:bg-ink-100 font-bold py-4 px-8 rounded-xl transition shadow-elevated">
              Registrar mi organización
              <app-icon name="arrow-right" [size]="18" />
            </a>
          </div>

          <div class="grid grid-cols-2 gap-4">
            @for (f of orgFeatures; track f.title; let i = $index) {
              <div class="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 animate-fade-in-up"
                [style.animationDelay]="(i * 80) + 'ms'"
                [style.marginTop]="i % 2 === 1 ? '1.5rem' : '0'">
                <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white mb-3">
                  <app-icon [name]="f.icon" [size]="20" />
                </div>
                <p class="font-bold text-white mb-1">{{ f.title }}</p>
                <p class="text-sm text-ink-400">{{ f.description }}</p>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
})
export class LandingComponent implements OnInit {
  private projectService = inject(ProjectService);
  private dashboardService = inject(DashboardService);

  stats = signal<DashboardStats | null>(null);
  featured = signal<Project[]>([]);

  steps = [
    { icon: 'search', title: 'Explora', description: 'Descubre proyectos verificados en todo el mundo, incluidas crisis olvidadas sin cobertura mediática.' },
    { icon: 'heart', title: 'Dona', description: 'Elige el monto y apoya el proyecto que más te importe, de forma anónima o pública.' },
    { icon: 'bar-chart', title: 'Visualiza', description: 'Sigue el impacto real de tu aporte con métricas y actualizaciones transparentes.' },
  ];

  orgFeatures = [
    { icon: 'image', title: 'Sube fotos', description: 'Muestra el impacto real con tu galería' },
    { icon: 'bar-chart', title: 'Métricas en vivo', description: 'Ve tu progreso en tiempo real' },
    { icon: 'globe', title: 'Alcance global', description: 'Donantes de todo el mundo' },
    { icon: 'shield', title: 'Verificado', description: 'Transparencia total' },
  ];

  statsCards = signal<any[]>([]);

  ngOnInit() {
    this.dashboardService.stats().subscribe((s) => {
      this.stats.set(s);
      this.statsCards.set([
        { icon: 'dollar', label: 'Recaudado', value: '$' + (s.totalRaised || 0).toLocaleString(), bg: '#FEE2E2', color: '#E11D48' },
        { icon: 'globe', label: 'Proyectos', value: (s.activeProjects || 0).toString(), bg: '#FFEDD5', color: '#EA580C' },
        { icon: 'heart', label: 'Donaciones', value: (s.totalDonations || 0).toString(), bg: '#FEF3C7', color: '#D97706' },
        { icon: 'users', label: 'Usuarios', value: (s.totalUsers || 0).toString(), bg: '#DCFCE7', color: '#059669' },
      ]);
    });
    this.projectService.list({ limit: 6 }).subscribe((res) => this.featured.set(res.items));
  }

  progress(p: Project) {
    return Math.min(100, (p.raised / p.goal) * 100);
  }
}