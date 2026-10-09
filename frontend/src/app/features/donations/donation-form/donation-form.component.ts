import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { DonationService } from '../../../core/services/donation.service';
import { Project } from '../../../core/models/project.model';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-donation-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent],
  template: `
    <div class="min-h-[calc(100vh-4rem)] bg-ink-50 bg-grid py-10 px-4">
      <div class="max-w-2xl mx-auto">

        <a [routerLink]="['/projects', project()?.id || '']"
          class="inline-flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-ink-900 transition mb-6">
          <app-icon name="arrow-left" [size]="16" />
          Volver al proyecto
        </a>

        <!-- Stepper -->
        <div class="flex items-center justify-between mb-8 px-4">
          @for (s of [1, 2, 3]; track s) {
            <div class="flex items-center flex-1">
              <div class="flex flex-col items-center gap-2 shrink-0">
                <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300"
                  [class.bg-primary-600]="step() >= s"
                  [class.text-white]="step() >= s"
                  [class.shadow-primary]="step() === s"
                  [class.bg-white]="step() < s"
                  [class.text-ink-400]="step() < s"
                  [class.border-2]="step() < s"
                  [class.border-ink-200]="step() < s">
                  @if (step() > s) {
                    <app-icon name="check" [size]="18" />
                  } @else {
                    {{ s }}
                  }
                </div>
                <span class="text-xs font-semibold whitespace-nowrap"
                  [class.text-primary-600]="step() >= s"
                  [class.text-ink-400]="step() < s">
                  {{ stepLabels[s - 1] }}
                </span>
              </div>
              @if (s < 3) {
                <div class="flex-1 h-0.5 mx-3 mb-6 transition-all duration-300"
                  [class.bg-primary-500]="step() > s"
                  [class.bg-ink-200]="step() <= s"></div>
              }
            </div>
          }
        </div>

        <!-- PASO 1: MONTO -->
        @if (step() === 1) {
          <div class="bg-white rounded-3xl shadow-elevated border border-ink-200 overflow-hidden animate-fade-in-up">

            @if (project()) {
              <div class="relative h-40 overflow-hidden bg-ink-900">
                @if (project()!.imageUrl) {
                  <img [src]="project()!.imageUrl" class="w-full h-full object-cover opacity-70" [alt]="project()!.title" />
                }
                <div class="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/60 to-transparent"></div>
                <div class="absolute bottom-0 left-0 right-0 p-6">
                  <p class="text-xs font-bold uppercase tracking-widest text-primary-300 mb-1">Estás donando a</p>
                  <h2 class="text-2xl font-bold text-white line-clamp-1">{{ project()!.title }}</h2>
                  <p class="text-sm text-ink-300 flex items-center gap-1.5 mt-1">
                    <app-icon name="map-pin" [size]="14" />
                    {{ project()!.country }}
                  </p>
                </div>
              </div>
            }

            <div class="p-8">
              <h1 class="text-2xl font-bold mb-1 text-ink-900">Elige tu monto</h1>
              <p class="text-ink-500 text-sm mb-6">100% de tu donación va al proyecto</p>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                @for (m of [10, 25, 50, 100]; track m) {
                  <button type="button"
                    (click)="setAmount(m)"
                    class="relative border-2 rounded-2xl py-5 font-bold text-lg transition-all duration-200"
                    [class.border-primary-500]="amount === m"
                    [class.bg-primary-50]="amount === m"
                    [class.text-primary-700]="amount === m"
                    [class.shadow-primary]="amount === m"
                    [class.border-ink-200]="amount !== m"
                    [class.text-ink-700]="amount !== m">
                    @if (amount === m) {
                      <span class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center">
                        <app-icon name="check" [size]="14" />
                      </span>
                    }
                    {{ '$' + m }}
                  </button>
                }
              </div>

              <div class="mb-6">
                <label class="label">O ingresa un monto personalizado</label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 font-bold text-lg">$</span>
                  <input type="number" class="input pl-10 text-lg font-bold"
                    [(ngModel)]="amount" min="1" placeholder="0.00" />
                </div>
              </div>

              <div class="mb-6">
                <label class="label">Mensaje de apoyo <span class="text-ink-400 font-normal">(opcional)</span></label>
                <textarea class="input resize-none" rows="3" [(ngModel)]="message"
                  placeholder="Escribe unas palabras de aliento..."></textarea>
              </div>

              <label class="flex items-start gap-3 p-4 border-2 rounded-2xl cursor-pointer transition-all mb-8"
                [class.border-primary-500]="isAnonymous"
                [class.bg-primary-50]="isAnonymous"
                [class.border-ink-200]="!isAnonymous">
                <input type="checkbox" [(ngModel)]="isAnonymous" class="mt-1 w-5 h-5 rounded accent-primary-600" />
                <div>
                  <p class="font-semibold text-ink-900">Donar de forma anónima</p>
                  <p class="text-sm text-ink-500 mt-0.5">Tu nombre no aparecerá en la lista pública de donantes</p>
                </div>
              </label>

              <div class="bg-ink-50 rounded-2xl p-5 mb-6 flex items-center justify-between">
                <div>
                  <p class="text-xs font-bold uppercase tracking-wider text-ink-500 mb-1">Total a donar</p>
                  <p class="text-3xl font-extrabold text-ink-900">{{ '$' + (amount || 0) }}</p>
                </div>
                <div class="w-14 h-14 rounded-2xl bg-white border border-ink-200 flex items-center justify-center text-primary-600">
                  <app-icon name="heart" [size]="28" />
                </div>
              </div>

              <button class="btn-primary w-full text-lg py-4"
                [disabled]="amount <= 0"
                (click)="step.set(2)">
                Continuar
                <app-icon name="arrow-right" [size]="18" />
              </button>
            </div>
          </div>
        }

        <!-- PASO 2: CONFIRMAR -->
        @if (step() === 2) {
          <div class="bg-white rounded-3xl shadow-elevated border border-ink-200 p-8 animate-fade-in-up">
            <div class="w-14 h-14 rounded-2xl bg-accent-100 text-accent-700 flex items-center justify-center mb-5">
              <app-icon name="shield" [size]="28" />
            </div>
            <h1 class="text-2xl font-bold mb-1 text-ink-900">Confirma tu donación</h1>
            <p class="text-ink-500 text-sm mb-6">Revisa los detalles antes de continuar</p>

            <div class="space-y-3 mb-6">
              <div class="flex justify-between items-start gap-4 py-4 border-b border-ink-100">
                <span class="text-sm text-ink-500 shrink-0">Proyecto</span>
                <span class="font-semibold text-ink-900 text-right">{{ project()?.title }}</span>
              </div>
              <div class="flex justify-between items-center py-4 border-b border-ink-100">
                <span class="text-sm text-ink-500">Ubicación</span>
                <span class="font-semibold text-ink-900 flex items-center gap-1.5">
                  <app-icon name="map-pin" [size]="14" />
                  {{ project()?.country }}
                </span>
              </div>
              <div class="flex justify-between items-center py-4 border-b border-ink-100">
                <span class="text-sm text-ink-500">Monto</span>
                <span class="text-2xl font-extrabold text-primary-600">{{ '$' + amount }}</span>
              </div>
              <div class="flex justify-between items-center py-4 border-b border-ink-100">
                <span class="text-sm text-ink-500">Donación anónima</span>
                <span class="font-semibold text-ink-900">{{ isAnonymous ? 'Sí' : 'No' }}</span>
              </div>
              @if (message) {
                <div class="py-4">
                  <p class="text-sm text-ink-500 mb-2">Mensaje</p>
                  <p class="text-ink-800 italic bg-ink-50 rounded-xl p-4">"{{ message }}"</p>
                </div>
              }
            </div>

            @if (error()) {
              <div class="bg-primary-50 border border-primary-200 text-primary-700 text-sm rounded-xl p-4 mb-6 flex items-start gap-3">
                <app-icon name="alert" [size]="20" class="shrink-0 mt-0.5" />
                <span>{{ error() }}</span>
              </div>
            }

            <div class="flex gap-3">
              <button class="btn-secondary flex-1" (click)="step.set(1)" [disabled]="loading()">
                <app-icon name="arrow-left" [size]="18" />
                Atrás
              </button>
              <button class="btn-primary flex-1" (click)="confirm()" [disabled]="loading()">
                @if (loading()) {
                  Procesando...
                } @else {
                  <app-icon name="heart" [size]="18" />
                  Confirmar donación
                }
              </button>
            </div>
          </div>
        }

        <!-- PASO 3: ÉXITO -->
        @if (step() === 3) {
          <div class="bg-white rounded-3xl shadow-elevated border border-ink-200 overflow-hidden animate-scale-in">
            <div class="relative bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 p-12 text-center text-white">
              <div class="absolute inset-0 bg-mesh-dark"></div>
              <div class="relative">
                <div class="w-20 h-20 rounded-full bg-white/20 backdrop-blur border-2 border-white/40 flex items-center justify-center mx-auto mb-5 animate-scale-in">
                  <app-icon name="check" [size]="40" />
                </div>
                <h1 class="text-3xl font-extrabold mb-2">¡Gracias por tu donación!</h1>
                <p class="text-white/90 text-lg">Tu aporte hace la diferencia</p>
              </div>
            </div>

            <div class="p-8 text-center">
              <p class="text-ink-500 mb-2">Has donado</p>
              <p class="text-5xl font-extrabold text-ink-900 mb-6">{{ '$' + amount }}</p>

              <div class="bg-ink-50 rounded-2xl p-5 mb-8 text-left">
                <p class="text-xs font-bold uppercase tracking-wider text-ink-500 mb-2">A</p>
                <p class="font-semibold text-ink-900">{{ project()?.title }}</p>
              </div>

              <p class="text-sm text-ink-500 mb-8">
                Recibirás actualizaciones sobre el impacto de tu donación.
              </p>

              <div class="flex flex-col sm:flex-row gap-3">
                <a routerLink="/projects" class="btn-secondary flex-1">
                  Ver más proyectos
                </a>
                <a [routerLink]="['/projects', project()?.id]" class="btn-primary flex-1">
                  Ver el proyecto
                </a>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class DonationFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private projectService = inject(ProjectService);
  private donationService = inject(DonationService);

  project = signal<Project | null>(null);
  step = signal(1);
  loading = signal(false);
  error = signal<string | null>(null);

  amount = 25;
  message = '';
  isAnonymous = false;

  stepLabels = ['Monto', 'Confirmar', 'Listo'];

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.projectService.getById(id).subscribe((p) => this.project.set(p));
  }

  setAmount(m: number) {
    this.amount = m;
  }

  confirm() {
    this.loading.set(true);
    this.error.set(null);
    this.donationService.create({
      amount: Number(this.amount),
      message: this.message || undefined,
      isAnonymous: this.isAnonymous,
      projectId: this.project()!.id,
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.step.set(3);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Error al procesar donación');
      },
    });
  }
}