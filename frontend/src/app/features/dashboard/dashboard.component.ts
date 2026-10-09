import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardStats, CategoryStat } from '../../core/services/dashboard.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="bg-ink-50 bg-grid min-h-[calc(100vh-4rem)]">
      <div class="max-w-7xl mx-auto px-6 py-12">

        <!-- Header -->
        <div class="mb-10">
          <p class="eyebrow">Análisis en tiempo real</p>
          <h1 class="section-title mb-2">Dashboard de impacto</h1>
          <p class="text-lg text-ink-600">El impacto de nuestra comunidad, medido en cifras</p>
        </div>

        <!-- Stats cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          @for (s of statCards(); track s.label; let i = $index) {
            <div class="relative bg-white rounded-3xl border border-ink-200 p-6 overflow-hidden group hover:shadow-elevated transition-all duration-300 animate-fade-in-up"
              [style.animationDelay]="(i * 80) + 'ms'">
              <div class="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2"
                [style.background-color]="s.color"></div>

              <div class="relative">
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  [style.background-color]="s.color + '20'"
                  [style.color]="s.color">
                  <app-icon [name]="s.icon" [size]="22" />
                </div>
                <p class="text-3xl font-extrabold text-ink-900 mb-1 tracking-tight">
                  {{ s.value }}
                </p>
                <p class="text-xs font-bold uppercase tracking-wider text-ink-500">{{ s.label }}</p>
              </div>
            </div>
          }
        </div>

        <div class="grid lg:grid-cols-3 gap-6">

          <!-- Chart por categoría -->
          <div class="lg:col-span-2 bg-white rounded-3xl border border-ink-200 p-8 shadow-soft">
            <div class="flex items-start justify-between mb-6">
              <div>
                <h2 class="text-xl font-bold text-ink-900 mb-1">Donaciones por categoría</h2>
                <p class="text-sm text-ink-500">Distribución de fondos por área de impacto</p>
              </div>
              <div class="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                <app-icon name="pie-chart" [size]="20" />
              </div>
            </div>

            @if (categories().length === 0 || totalCategories() === 0) {
              <div class="text-center py-16">
                <div class="w-16 h-16 rounded-2xl bg-ink-100 mx-auto mb-4 flex items-center justify-center text-ink-400">
                  <app-icon name="bar-chart" [size]="28" />
                </div>
                <p class="text-ink-500 font-medium">Sin datos aún</p>
                <p class="text-sm text-ink-400 mt-1">Las donaciones aparecerán aquí</p>
              </div>
            } @else {
              <div class="space-y-5">
                @for (c of categories(); track c.category; let i = $index) {
                  <div class="animate-fade-in-up" [style.animationDelay]="(i * 60) + 'ms'">
                    <div class="flex items-center justify-between mb-2">
                      <span class="font-semibold text-ink-800 text-sm">{{ c.category }}</span>
                      <div class="flex items-center gap-3">
                        <span class="text-sm text-ink-500">{{ percent(c.total) | number:'1.0-0' }}%</span>
                        <span class="font-bold text-ink-900 tabular-nums">{{ c.total | currency:'USD':'symbol':'1.0-0' }}</span>
                      </div>
                    </div>
                    <div class="w-full bg-ink-100 rounded-full h-3 overflow-hidden">
                      <div class="h-full rounded-full transition-all duration-700 ease-out"
                        [style.width.%]="percent(c.total)"
                        [style.background]="categoryColor(i)"></div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>

          <!-- Info lateral -->
          <div class="space-y-6">
            <div class="relative bg-ink-900 rounded-3xl p-6 overflow-hidden">
              <div class="absolute inset-0 bg-mesh-dark"></div>
              <div class="relative">
                <div class="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center text-white mb-4 border border-white/20">
                  <app-icon name="trending-up" [size]="22" />
                </div>
                <p class="text-xs font-bold uppercase tracking-wider text-primary-300 mb-1">Ticket promedio</p>
                <p class="text-3xl font-extrabold text-white mb-2">{{ avgDonation() | currency:'USD':'symbol':'1.0-0' }}</p>
                <p class="text-sm text-ink-400">por donación registrada</p>
              </div>
            </div>

            <div class="bg-gradient-to-br from-accent-500 to-secondary-500 rounded-3xl p-6 text-white shadow-elevated">
              <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-4">
                <app-icon name="heart" [size]="22" />
              </div>
              <p class="text-xs font-bold uppercase tracking-wider text-white/80 mb-1">Comunidad</p>
              <p class="text-3xl font-extrabold mb-2">{{ stats()?.totalUsers || 0 }}</p>
              <p class="text-sm text-white/80">personas ya son parte del cambio</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private service = inject(DashboardService);

  stats = signal<DashboardStats | null>(null);
  categories = signal<CategoryStat[]>([]);
  statCards = signal<any[]>([]);

  private palette = ['#E11D48', '#EA580C', '#D97706', '#059669', '#0891B2', '#7C3AED'];

  ngOnInit() {
    this.service.stats().subscribe((s) => {
      this.stats.set(s);
      this.statCards.set([
        {
          icon: 'dollar',
          label: 'Total recaudado',
          value: '$' + (s.totalRaised || 0).toLocaleString('en-US', { maximumFractionDigits: 0 }),
          color: '#E11D48'
        },
        {
          icon: 'heart',
          label: 'Donaciones',
          value: (s.totalDonations || 0).toString(),
          color: '#EA580C'
        },
        {
          icon: 'globe',
          label: 'Proyectos activos',
          value: (s.activeProjects || 0).toString(),
          color: '#D97706'
        },
        {
          icon: 'users',
          label: 'Usuarios',
          value: (s.totalUsers || 0).toString(),
          color: '#059669'
        },
      ]);
    });

    this.service.byCategory().subscribe((c) => this.categories.set(c));
  }

  totalCategories(): number {
    return this.categories().reduce((sum, c) => sum + c.total, 0);
  }

  percent(value: number): number {
    const total = this.totalCategories();
    return total > 0 ? (value / total) * 100 : 0;
  }

  categoryColor(index: number): string {
    const c = this.palette[index % this.palette.length];
    return `linear-gradient(90deg, ${c}, ${c}CC)`;
  }

  avgDonation(): number {
    const s = this.stats();
    if (!s || !s.totalDonations) return 0;
    return s.totalRaised / s.totalDonations;
  }
}