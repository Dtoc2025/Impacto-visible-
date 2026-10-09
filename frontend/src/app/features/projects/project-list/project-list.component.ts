import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, catchError, debounceTime, distinctUntilChanged, of, switchMap, tap } from 'rxjs';
import { ProjectService } from '../../../core/services/project.service';
import { Project, Category } from '../../../core/models/project.model';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ImageUrlPipe } from '../../../shared/pipes/image-url.pipe';

type FilterKey = 'search' | 'category' | 'urgency' | 'forgotten';

const URGENCIES = [
  { value: 'CRITICAL', label: 'Crítica' },
  { value: 'HIGH', label: 'Alta' },
  { value: 'MEDIUM', label: 'Media' },
  { value: 'LOW', label: 'Baja' },
] as const;

@Component({
  selector: 'app-project-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent, ImageUrlPipe],
  template: `
    <div class="bg-ink-50 bg-grid min-h-[calc(100vh-4rem)]">
      <div class="max-w-7xl mx-auto px-6 py-12">

        <header class="mb-10">
          <p class="eyebrow">Causas verificadas</p>
          <h1 class="section-title mb-2">Proyectos humanitarios</h1>
          <p class="text-lg text-ink-600">Apoya causas reales alrededor del mundo</p>
        </header>

        <section class="bg-white rounded-3xl border border-ink-200 shadow-soft mb-8" aria-label="Filtros de proyectos">
          <div class="p-5 flex flex-wrap items-center gap-3">
            <div class="relative flex-1 min-w-[240px]">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none">
                <app-icon name="search" [size]="18" />
              </span>
              <input type="search" aria-label="Buscar proyectos"
                class="w-full h-11 bg-ink-50 hover:bg-ink-100/50 focus:bg-white border border-ink-200 focus:border-primary-500 rounded-xl pl-11 pr-10 text-sm text-ink-900 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                [ngModel]="search()"
                (ngModelChange)="onSearch($event)"
                placeholder="Buscar proyectos..." />
              @if (search()) {
                <button type="button" aria-label="Borrar búsqueda"
                  (click)="removeFilter('search')"
                  class="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full hover:bg-ink-200 text-ink-400 hover:text-ink-700 flex items-center justify-center transition">
                  <app-icon name="x" [size]="14" />
                </button>
              }
            </div>

            <div class="relative">
              <select aria-label="Filtrar por categoría"
                class="h-11 bg-ink-50 hover:bg-ink-100/50 border border-ink-200 focus:border-primary-500 rounded-xl pl-4 pr-10 text-sm font-medium text-ink-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none cursor-pointer min-w-[160px]"
                [ngModel]="category()" (ngModelChange)="setFilter('category', $event)">
                <option value="">Todas las categorías</option>
                @for (c of categories(); track c.id) {
                  <option [value]="c.slug">{{ c.name }}</option>
                }
              </select>
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none">
                <app-icon name="chevron-down" [size]="16" />
              </span>
            </div>

            <div class="relative">
              <select aria-label="Filtrar por urgencia"
                class="h-11 bg-ink-50 hover:bg-ink-100/50 border border-ink-200 focus:border-primary-500 rounded-xl pl-4 pr-10 text-sm font-medium text-ink-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none cursor-pointer min-w-[140px]"
                [ngModel]="urgency()" (ngModelChange)="setFilter('urgency', $event)">
                <option value="">Urgencia</option>
                @for (u of urgencies; track u.value) {
                  <option [value]="u.value">{{ u.label }}</option>
                }
              </select>
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none">
                <app-icon name="chevron-down" [size]="16" />
              </span>
            </div>

            <button type="button"
              [attr.aria-pressed]="forgotten()"
              aria-label="Filtrar crisis olvidadas"
              (click)="toggleForgotten()"
              class="h-11 px-4 rounded-xl border flex items-center gap-3 transition-all"
              [class.bg-primary-600]="forgotten()"
              [class.border-primary-600]="forgotten()"
              [class.text-white]="forgotten()"
              [class.bg-ink-50]="!forgotten()"
              [class.border-ink-200]="!forgotten()"
              [class.text-ink-700]="!forgotten()"
              [class.hover:bg-ink-100]="!forgotten()">
              <app-icon name="alert" [size]="16" />
              <span class="text-sm font-semibold whitespace-nowrap">Olvidadas</span>
              <span class="relative inline-block w-8 h-4 rounded-full transition"
                [class.bg-white]="forgotten()"
                [class.bg-ink-300]="!forgotten()">
                <span class="absolute top-0.5 w-3 h-3 rounded-full shadow transition-all"
                  [class.bg-white]="!forgotten()"
                  [class.bg-primary-600]="forgotten()"
                  [class.left-0.5]="!forgotten()"
                  [class.left-4]="forgotten()"></span>
              </span>
            </button>
          </div>

          @if (activeFilters().length) {
            <div class="px-5 pb-5 flex flex-wrap items-center gap-2">
              <span class="text-xs font-bold uppercase tracking-wider text-ink-400 mr-1">Filtros:</span>

              @for (f of activeFilters(); track f.key) {
                <span class="inline-flex items-center gap-1.5 bg-primary-50 text-primary-700 border border-primary-200 text-xs font-semibold px-3 py-1.5 rounded-lg">
                  {{ f.label }}
                  <button type="button" [attr.aria-label]="'Quitar filtro: ' + f.label"
                    (click)="removeFilter(f.key)" class="hover:text-primary-900 ml-0.5">
                    <app-icon name="x" [size]="12" />
                  </button>
                </span>
              }

              <button type="button" (click)="clearFilters()"
                class="ml-auto text-xs font-bold text-primary-600 hover:text-primary-700 underline underline-offset-2 transition">
                Limpiar todo
              </button>
            </div>
          }
        </section>

        <div aria-live="polite" [attr.aria-busy]="loading()">
          @if (loading()) {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (i of skeletons; track i) {
                <div class="bg-white rounded-3xl border border-ink-200 overflow-hidden">
                  <div class="h-48 skeleton"></div>
                  <div class="p-6 space-y-3">
                    <div class="h-4 skeleton w-1/3"></div>
                    <div class="h-5 skeleton w-3/4"></div>
                    <div class="h-4 skeleton w-1/2"></div>
                    <div class="h-2 skeleton w-full"></div>
                  </div>
                </div>
              }
            </div>
          } @else if (error()) {
            <div class="bg-white rounded-3xl border border-ink-200 p-16 text-center" role="alert">
              <div class="w-20 h-20 rounded-3xl bg-ink-100 text-ink-400 mx-auto mb-6 flex items-center justify-center">
                <app-icon name="alert" [size]="36" />
              </div>
              <h2 class="text-2xl font-bold text-ink-900 mb-2">No pudimos cargar los proyectos</h2>
              <p class="text-ink-500 mb-6">Revisa tu conexión e inténtalo de nuevo</p>
              <button type="button" (click)="load()" class="btn-primary">Reintentar</button>
            </div>
          } @else if (projects().length === 0) {
            <div class="relative bg-white rounded-3xl border border-ink-200 overflow-hidden">
              <div class="absolute inset-0 bg-mesh-primary opacity-20"></div>
              <div class="relative p-16 text-center">
                <div class="w-20 h-20 rounded-3xl bg-ink-100 text-ink-400 mx-auto mb-6 flex items-center justify-center">
                  <app-icon name="search" [size]="36" />
                </div>
                <h2 class="text-2xl font-bold text-ink-900 mb-2">Sin resultados</h2>
                <p class="text-ink-500 mb-6">No encontramos proyectos con esos filtros</p>
                @if (activeFilters().length) {
                  <button type="button" (click)="clearFilters()" class="btn-primary">Limpiar filtros</button>
                }
              </div>
            </div>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (p of projects(); track p.id; let i = $index) {
                <a [routerLink]="['/projects', p.id]"
                  class="group bg-white rounded-3xl border border-ink-200 overflow-hidden hover:shadow-elevated hover:-translate-y-2 focus-visible:ring-2 focus-visible:ring-primary-500 transition-all duration-500 flex flex-col animate-fade-in-up"
                  [style.animationDelay]="(i * 50) + 'ms'">

                  <div class="relative aspect-[16/10] overflow-hidden bg-ink-100">
                    @if (p.imageUrl) {
                      <img [src]="p.imageUrl | imageUrl" [alt]="p.title" loading="lazy" decoding="async"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    } @else {
                      <div class="w-full h-full bg-gradient-to-br from-primary-100 via-accent-100 to-secondary-100"></div>
                    }
                    <div class="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/10 to-transparent"></div>

                    @if (p.isForgotten) {
                      <span class="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-primary-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg">
                        <app-icon name="alert" [size]="12" />
                        Crisis olvidada
                      </span>
                    }

                    <span class="absolute bottom-4 left-4 text-white text-xs font-bold uppercase tracking-wider">
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
                      <div class="w-full bg-ink-100 rounded-full h-2 overflow-hidden mb-2"
                        role="progressbar" aria-valuemin="0" aria-valuemax="100"
                        [attr.aria-valuenow]="progress(p) | number:'1.0-0'"
                        [attr.aria-label]="'Progreso de ' + p.title">
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

            <nav aria-label="Paginación" class="flex justify-center items-center gap-3 mt-12">
              <button type="button" class="btn-secondary" [disabled]="page() === 1" (click)="goTo(page() - 1)">
                <app-icon name="arrow-left" [size]="16" />
                Anterior
              </button>
              <span class="px-4 py-2 text-sm font-semibold text-ink-700" aria-current="page">Página {{ page() }}</span>
              <button type="button" class="btn-secondary" [disabled]="!hasNext()" (click)="goTo(page() + 1)">
                Siguiente
                <app-icon name="arrow-right" [size]="16" />
              </button>
            </nav>
          }
        </div>
      </div>
    </div>
  `,
})
export class ProjectListComponent {
  private service = inject(ProjectService);
  private destroyRef = inject(DestroyRef);

  readonly urgencies = URGENCIES;
  readonly skeletons = [1, 2, 3, 4, 5, 6];
  readonly limit = 9;

  projects = signal<Project[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(false);
  error = signal(false);

  search = signal('');
  category = signal('');
  urgency = signal('');
  forgotten = signal(false);
  page = signal(1);

  hasNext = computed(() => this.projects().length >= this.limit);

  activeFilters = computed(() => {
    const filters: { key: FilterKey; label: string }[] = [];
    if (this.search()) filters.push({ key: 'search', label: `"${this.search()}"` });
    if (this.category()) {
      const name = this.categories().find((c) => c.slug === this.category())?.name ?? this.category();
      filters.push({ key: 'category', label: name });
    }
    if (this.urgency()) {
      const label = URGENCIES.find((u) => u.value === this.urgency())?.label ?? this.urgency();
      filters.push({ key: 'urgency', label: `Urgencia ${label.toLowerCase()}` });
    }
    if (this.forgotten()) filters.push({ key: 'forgotten', label: 'Crisis olvidadas' });
    return filters;
  });

  private load$ = new Subject<void>();
  private search$ = new Subject<string>();

  constructor() {
    this.load$
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.error.set(false);
        }),
        switchMap(() =>
          this.service
            .list({
              page: this.page(),
              limit: this.limit,
              search: this.search() || undefined,
              category: this.category() || undefined,
              urgency: this.urgency() || undefined,
              forgotten: this.forgotten() || undefined,
            })
            .pipe(
              catchError(() => {
                this.error.set(true);
                return of(null);
              }),
            ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((res) => {
        if (res) this.projects.set(res.items);
        this.loading.set(false);
      });

    this.search$
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(() => this.reload());

    this.service
      .categories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((c) => this.categories.set(c));

    this.load();
  }

  onSearch(value: string) {
    this.search.set(value ?? '');
    this.search$.next(this.search().trim());
  }

  toggleForgotten() {
    this.forgotten.set(!this.forgotten());
    this.reload();
  }

  setFilter(key: Exclude<FilterKey, 'search'>, value: string | boolean) {
    if (key === 'forgotten') this.forgotten.set(value as boolean);
    else if (key === 'category') this.category.set(value as string);
    else this.urgency.set(value as string);
    this.reload();
  }

  removeFilter(key: FilterKey) {
    if (key === 'search') this.search.set('');
    else if (key === 'category') this.category.set('');
    else if (key === 'urgency') this.urgency.set('');
    else this.forgotten.set(false);
    this.reload();
  }

  clearFilters() {
    this.search.set('');
    this.category.set('');
    this.urgency.set('');
    this.forgotten.set(false);
    this.reload();
  }

  reload() {
    this.page.set(1);
    this.load();
  }

  load() {
    this.load$.next();
  }

  goTo(page: number) {
    if (page < 1) return;
    this.page.set(page);
    this.load();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  progress(p: Project): number {
    if (!p.goal || p.goal <= 0) return 0;
    return Math.min(100, Math.max(0, (p.raised / p.goal) * 100));
  }
}