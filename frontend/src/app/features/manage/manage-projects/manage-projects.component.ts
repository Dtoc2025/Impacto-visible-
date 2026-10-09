import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/project.model';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-manage-projects',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  template: `
    <div class="bg-ink-50 bg-grid min-h-[calc(100vh-4rem)]">
      <div class="max-w-7xl mx-auto px-6 py-12">

        <!-- Header -->
        <div class="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p class="eyebrow">Panel de organización</p>
            <h1 class="section-title mb-2">Mis proyectos</h1>
            <p class="text-lg text-ink-600">Gestiona los proyectos que tu organización ha publicado</p>
          </div>
          <a routerLink="/manage/projects/new" class="btn-primary">
            <app-icon name="plus" [size]="18" />
            Nuevo proyecto
          </a>
        </div>

        <!-- Estado: cargando -->
        @if (loading()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (i of [1,2,3]; track i) {
              <div class="bg-white rounded-3xl border border-ink-200 overflow-hidden">
                <div class="h-48 skeleton"></div>
                <div class="p-6 space-y-3">
                  <div class="h-4 skeleton w-1/3"></div>
                  <div class="h-5 skeleton w-3/4"></div>
                  <div class="h-4 skeleton w-1/2"></div>
                </div>
              </div>
            }
          </div>
        }

        <!-- Estado: vacío -->
        @else if (projects().length === 0) {
          <div class="relative bg-white rounded-3xl border border-ink-200 overflow-hidden">
            <div class="absolute inset-0 bg-mesh-primary opacity-30"></div>
            <div class="relative p-16 text-center">
              <div class="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white mx-auto mb-6 flex items-center justify-center shadow-primary">
                <app-icon name="bar-chart" [size]="36" />
              </div>
              <h2 class="text-2xl font-bold text-ink-900 mb-2">Aún no tienes proyectos</h2>
              <p class="text-ink-500 mb-8 max-w-md mx-auto">Crea tu primer proyecto y empieza a recibir apoyo de donantes de todo el mundo</p>
              <a routerLink="/manage/projects/new" class="btn-primary inline-flex">
                <app-icon name="plus" [size]="18" />
                Crear mi primer proyecto
              </a>
            </div>
          </div>
        }

        <!-- Lista de proyectos -->
        @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (p of projects(); track p.id; let i = $index) {
              <div class="group bg-white rounded-3xl border border-ink-200 overflow-hidden hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 flex flex-col animate-fade-in-up"
                [style.animationDelay]="(i * 60) + 'ms'">

                <!-- Imagen -->
                <div class="relative aspect-[16/10] bg-ink-100 overflow-hidden">
                  @if (p.imageUrl) {
                    <img [src]="p.imageUrl" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" [alt]="p.title" />
                  } @else {
                    <div class="w-full h-full bg-gradient-to-br from-primary-100 via-accent-100 to-secondary-100 flex items-center justify-center text-ink-300">
                      <app-icon name="image" [size]="48" />
                    </div>
                  }

                  <!-- Badges -->
                  @if (p.isForgotten) {
                    <span class="absolute top-3 left-3 inline-flex items-center gap-1 bg-primary-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg">
                      <app-icon name="alert" [size]="12" />
                      Crisis olvidada
                    </span>
                  }
                </div>

                <!-- Contenido -->
                <div class="p-6 flex-1 flex flex-col">
                  <div class="flex items-center gap-2 mb-3">
                    <span class="chip" [style.background-color]="(p.category.color || '#E5E7EB') + '20'" [style.color]="p.category.color || '#374151'">
                      {{ p.category.name }}
                    </span>
                  </div>

                  <h3 class="font-bold text-lg mb-1 text-ink-900 line-clamp-2 group-hover:text-primary-600 transition">{{ p.title }}</h3>
                  <p class="text-sm text-ink-500 flex items-center gap-1.5 mb-4">
                    <app-icon name="map-pin" [size]="14" />
                    {{ p.country }}
                  </p>

                  <!-- Progreso -->
                  <div class="mt-auto">
                    <div class="flex justify-between text-sm mb-2">
                      <span class="font-bold text-primary-600">{{ p.raised | currency:'USD':'symbol':'1.0-0' }}</span>
                      <span class="text-ink-500">de {{ p.goal | currency:'USD':'symbol':'1.0-0' }}</span>
                    </div>
                    <div class="w-full bg-ink-100 rounded-full h-2 overflow-hidden mb-3">
                      <div class="bg-gradient-to-r from-primary-500 to-secondary-500 h-full rounded-full transition-all duration-700"
                        [style.width.%]="progress(p)"></div>
                    </div>
                    <div class="flex justify-between text-xs text-ink-500">
                      <span class="font-medium">{{ progress(p) | number:'1.0-0' }}% completado</span>
                      <span class="inline-flex items-center gap-1">
                        <app-icon name="heart" [size]="12" />
                        {{ p._count?.donations || 0 }} donaciones
                      </span>
                    </div>
                  </div>

                  <!-- Acciones -->
                  <div class="flex gap-2 mt-6 pt-4 border-t border-ink-100">
                    <a [routerLink]="['/projects', p.id]" class="btn-secondary text-sm flex-1 py-2.5">
                      <app-icon name="globe" [size]="14" />
                      Ver
                    </a>
                    <a [routerLink]="['/manage/projects', p.id, 'edit']" class="btn-primary text-sm flex-1 py-2.5">
                      <app-icon name="edit" [size]="14" />
                      Editar
                    </a>
                    <button (click)="remove(p)"
                      class="w-10 h-10 rounded-xl border border-ink-200 text-ink-500 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600 transition flex items-center justify-center shrink-0">
                      <app-icon name="trash" [size]="16" />
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class ManageProjectsComponent implements OnInit {
  private service = inject(ProjectService);
  projects = signal<Project[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.service.mine().subscribe({
      next: (p) => { this.projects.set(p); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  progress(p: Project) {
    return Math.min(100, (p.raised / p.goal) * 100);
  }

  remove(p: Project) {
    if (!confirm(`¿Eliminar "${p.title}"? Esta acción no se puede deshacer.`)) return;
    this.service.remove(p.id).subscribe({
      next: () => this.projects.update(list => list.filter(x => x.id !== p.id)),
      error: (err) => alert(err.error?.message || 'Error al eliminar'),
    });
  }
}