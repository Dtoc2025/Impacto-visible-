import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DonationService } from '../../../core/services/donation.service';
import { Donation } from '../../../core/models/donation.model';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-my-donations',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  template: `
    <div class="bg-ink-50 bg-grid min-h-[calc(100vh-4rem)]">
      <div class="max-w-4xl mx-auto px-6 py-12">

        <div class="mb-10">
          <p class="eyebrow">Tu historial</p>
          <h1 class="section-title mb-2">Mis donaciones</h1>
          <p class="text-lg text-ink-600">Todas las causas que has apoyado</p>
        </div>

        <!-- Resumen -->
        @if (!loading() && donations().length > 0) {
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div class="bg-white rounded-3xl border border-ink-200 p-6">
              <p class="text-xs font-bold uppercase tracking-wider text-ink-500 mb-2">Total donado</p>
              <p class="text-2xl font-extrabold text-primary-600">{{ totalDonated() | currency:'USD':'symbol':'1.0-0' }}</p>
            </div>
            <div class="bg-white rounded-3xl border border-ink-200 p-6">
              <p class="text-xs font-bold uppercase tracking-wider text-ink-500 mb-2">Donaciones</p>
              <p class="text-2xl font-extrabold text-ink-900">{{ donations().length }}</p>
            </div>
            <div class="bg-white rounded-3xl border border-ink-200 p-6 col-span-2 md:col-span-1">
              <p class="text-xs font-bold uppercase tracking-wider text-ink-500 mb-2">Causas apoyadas</p>
              <p class="text-2xl font-extrabold text-secondary-600">{{ uniqueProjects() }}</p>
            </div>
          </div>
        }

        <!-- Cargando -->
        @if (loading()) {
          <div class="space-y-4">
            @for (i of [1,2,3]; track i) {
              <div class="bg-white rounded-3xl border border-ink-200 p-6">
                <div class="h-5 skeleton w-3/4 mb-3 rounded"></div>
                <div class="h-4 skeleton w-1/3 rounded"></div>
              </div>
            }
          </div>
        }

        <!-- Vacío -->
        @else if (donations().length === 0) {
          <div class="relative bg-white rounded-3xl border border-ink-200 overflow-hidden">
            <div class="absolute inset-0 bg-mesh-primary opacity-20"></div>
            <div class="relative p-16 text-center">
              <div class="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white mx-auto mb-6 flex items-center justify-center shadow-primary">
                <app-icon name="heart" [size]="36" />
              </div>
              <h2 class="text-2xl font-bold text-ink-900 mb-2">Aún no has donado</h2>
              <p class="text-ink-500 mb-8 max-w-md mx-auto">Explora proyectos y empieza a cambiar vidas hoy mismo</p>
              <a routerLink="/projects" class="btn-primary inline-flex">
                Explorar proyectos
                <app-icon name="arrow-right" [size]="18" />
              </a>
            </div>
          </div>
        }

        <!-- Lista -->
        @else {
          <div class="space-y-4">
            @for (d of donations(); track d.id; let i = $index) {
              <a [routerLink]="['/projects', d.projectId]"
                class="group bg-white rounded-3xl border border-ink-200 p-6 flex items-center gap-4 hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-up"
                [style.animationDelay]="(i * 50) + 'ms'">

                @if (d.project?.imageUrl) {
                  <img [src]="d.project!.imageUrl" class="w-16 h-16 rounded-2xl object-cover shrink-0" />
                } @else {
                  <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 shrink-0 flex items-center justify-center text-ink-400">
                    <app-icon name="globe" [size]="24" />
                  </div>
                }

                <div class="flex-1 min-w-0">
                  <p class="font-bold text-ink-900 mb-1 group-hover:text-primary-600 transition truncate">{{ d.project?.title }}</p>
                  <div class="flex items-center gap-3 text-sm text-ink-500">
                    <span class="flex items-center gap-1.5">
                      <app-icon name="map-pin" [size]="14" />
                      {{ d.project?.country }}
                    </span>
                    <span class="text-ink-300">·</span>
                    <span>{{ d.createdAt | date:'mediumDate' }}</span>
                  </div>
                  @if (d.message) {
                    <p class="text-sm text-ink-600 italic mt-2 line-clamp-1">"{{ d.message }}"</p>
                  }
                </div>

                <div class="text-right shrink-0">
                  <p class="text-lg font-extrabold text-primary-600">{{ d.amount | currency:'USD':'symbol':'1.0-0' }}</p>
                  @if (d.isAnonymous) {
                    <span class="text-[10px] font-bold uppercase tracking-wider text-ink-400">Anónima</span>
                  }
                </div>
              </a>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class MyDonationsComponent implements OnInit {
  private service = inject(DonationService);
  donations = signal<Donation[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.service.myDonations().subscribe({
      next: (d) => { this.donations.set(d); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  totalDonated(): number {
    return this.donations().reduce((s, d) => s + Number(d.amount), 0);
  }

  uniqueProjects(): number {
    return new Set(this.donations().map(d => d.projectId)).size;
  }
}