import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { UploadService } from '../../../core/services/upload.service';
import { Category } from '../../../core/models/project.model';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent],
  template: `
    <div class="bg-ink-50 bg-grid min-h-[calc(100vh-4rem)]">
      <div class="max-w-3xl mx-auto px-6 py-12">

        <a routerLink="/manage/projects" class="inline-flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-ink-900 transition mb-6">
          <app-icon name="arrow-left" [size]="16" />
          Volver a mis proyectos
        </a>

        <div class="mb-10">
          <p class="eyebrow">{{ isEdit() ? 'Editar' : 'Nuevo proyecto' }}</p>
          <h1 class="section-title mb-2">{{ isEdit() ? 'Editar proyecto' : 'Crear nuevo proyecto' }}</h1>
          <p class="text-lg text-ink-600">Completa la información para {{ isEdit() ? 'actualizar' : 'publicar' }} tu proyecto</p>
        </div>

        @if (error()) {
          <div class="bg-primary-50 border border-primary-200 text-primary-700 text-sm rounded-2xl p-4 mb-6 flex items-start gap-3">
            <app-icon name="alert" [size]="20" class="shrink-0 mt-0.5" />
            <span>{{ error() }}</span>
          </div>
        }

        <form (ngSubmit)="save()" #f="ngForm" class="space-y-6">

          <!-- Imagen principal -->
          <div class="bg-white rounded-3xl border border-ink-200 overflow-hidden shadow-soft">
            <div class="px-6 py-4 border-b border-ink-100 flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                <app-icon name="image" [size]="18" />
              </div>
              <div>
                <h2 class="font-bold text-ink-900">Imagen principal</h2>
                <p class="text-xs text-ink-500">La primera impresión que verán los donantes</p>
              </div>
            </div>

            <div class="p-6">
              <div class="relative aspect-[16/9] rounded-2xl overflow-hidden bg-ink-100 mb-4">
                @if (form.imageUrl) {
                  <img [src]="form.imageUrl" class="w-full h-full object-cover" />
                  <button type="button" (click)="form.imageUrl = ''"
                    class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur text-ink-700 hover:bg-white flex items-center justify-center shadow-md transition">
                    <app-icon name="x" [size]="16" />
                  </button>
                } @else {
                  <div class="w-full h-full flex flex-col items-center justify-center text-ink-400">
                    <app-icon name="image" [size]="40" />
                    <p class="text-sm mt-2 font-medium">Sin imagen</p>
                  </div>
                }
              </div>

              <label class="btn-secondary cursor-pointer w-full justify-center">
                @if (uploading()) {
                  Subiendo imagen...
                } @else {
                  <app-icon name="upload" [size]="16" />
                  {{ form.imageUrl ? 'Cambiar imagen' : 'Subir imagen' }}
                }
                <input type="file" accept="image/*" (change)="onImageSelected($event)" class="hidden" [disabled]="uploading()" />
              </label>
            </div>
          </div>

          <!-- Galería -->
          <div class="bg-white rounded-3xl border border-ink-200 overflow-hidden shadow-soft">
            <div class="px-6 py-4 border-b border-ink-100 flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-accent-100 text-accent-600 flex items-center justify-center">
                <app-icon name="image" [size]="18" />
              </div>
              <div>
                <h2 class="font-bold text-ink-900">Galería</h2>
                <p class="text-xs text-ink-500">Muestra más fotos del proyecto (opcional)</p>
              </div>
            </div>

            <div class="p-6">
              @if (form.gallery.length > 0) {
                <div class="grid grid-cols-3 gap-3 mb-4">
                  @for (img of form.gallery; track img) {
                    <div class="relative group aspect-square rounded-xl overflow-hidden bg-ink-100">
                      <img [src]="img" class="w-full h-full object-cover" />
                      <button type="button" (click)="removeGalleryImage(img)"
                        class="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur text-ink-700 hover:bg-primary-600 hover:text-white flex items-center justify-center shadow-md transition opacity-0 group-hover:opacity-100">
                        <app-icon name="x" [size]="14" />
                      </button>
                    </div>
                  }
                </div>
              }

              <label class="btn-secondary cursor-pointer w-full justify-center">
                @if (uploadingGallery()) {
                  Subiendo imágenes...
                } @else {
                  <app-icon name="plus" [size]="16" />
                  Añadir imágenes
                }
                <input type="file" accept="image/*" multiple (change)="onGallerySelected($event)" class="hidden" [disabled]="uploadingGallery()" />
              </label>
            </div>
          </div>

          <!-- Info básica -->
          <div class="bg-white rounded-3xl border border-ink-200 overflow-hidden shadow-soft">
            <div class="px-6 py-4 border-b border-ink-100 flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-secondary-100 text-secondary-600 flex items-center justify-center">
                <app-icon name="edit" [size]="18" />
              </div>
              <div>
                <h2 class="font-bold text-ink-900">Información básica</h2>
                <p class="text-xs text-ink-500">Los datos principales del proyecto</p>
              </div>
            </div>

            <div class="p-6 space-y-5">
              <div>
                <label class="label">Título <span class="text-primary-600">*</span></label>
                <input class="input" name="title" [(ngModel)]="form.title" required minlength="3"
                  placeholder="Ej: Alimentación para familias en Gaza" />
              </div>

              <div>
                <label class="label">Subtítulo</label>
                <input class="input" name="subtitle" [(ngModel)]="form.subtitle"
                  placeholder="Una frase corta que resume el proyecto" />
              </div>

              <div>
                <label class="label">Descripción <span class="text-primary-600">*</span></label>
                <textarea class="input resize-none" name="description" rows="5" [(ngModel)]="form.description" required minlength="10"
                  placeholder="Explica el proyecto, el contexto y por qué es urgente..."></textarea>
              </div>

              <div>
                <label class="label">Impacto esperado</label>
                <textarea class="input resize-none" name="impact" rows="3" [(ngModel)]="form.impact"
                  placeholder="Ej: $50 = alimentación para una familia durante 2 semanas"></textarea>
              </div>

              <div>
                <label class="label">Beneficiarios estimados</label>
                <input type="number" class="input" name="beneficiaries" [(ngModel)]="form.beneficiaries" min="0"
                  placeholder="Ej: 500" />
              </div>
            </div>
          </div>

          <!-- Ubicación -->
          <div class="bg-white rounded-3xl border border-ink-200 overflow-hidden shadow-soft">
            <div class="px-6 py-4 border-b border-ink-100 flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-success-50 text-success-600 flex items-center justify-center">
                <app-icon name="map-pin" [size]="18" />
              </div>
              <div>
                <h2 class="font-bold text-ink-900">Ubicación</h2>
                <p class="text-xs text-ink-500">¿Dónde se desarrolla el proyecto?</p>
              </div>
            </div>

            <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="label">País <span class="text-primary-600">*</span></label>
                <input class="input" name="country" [(ngModel)]="form.country" required placeholder="Ej: Yemen" />
              </div>
              <div>
                <label class="label">Región</label>
                <input class="input" name="region" [(ngModel)]="form.region" placeholder="Ej: Sanaa" />
              </div>
            </div>
          </div>

          <!-- Clasificación -->
          <div class="bg-white rounded-3xl border border-ink-200 overflow-hidden shadow-soft">
            <div class="px-6 py-4 border-b border-ink-100 flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-accent-100 text-accent-600 flex items-center justify-center">
                <app-icon name="filter" [size]="18" />
              </div>
              <div>
                <h2 class="font-bold text-ink-900">Clasificación</h2>
                <p class="text-xs text-ink-500">Cómo encontrarán los donantes este proyecto</p>
              </div>
            </div>

            <div class="p-6 space-y-5">
              <div>
                <label class="label">Categoría <span class="text-primary-600">*</span></label>
                <select class="input" name="categoryId" [(ngModel)]="form.categoryId" required>
                  <option [ngValue]="null">Selecciona una categoría...</option>
                  @for (c of categories(); track c.id) {
                    <option [ngValue]="c.id">{{ c.name }}</option>
                  }
                </select>
              </div>

              <div>
                <label class="label">Nivel de urgencia</label>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                  @for (u of urgencies; track u.value) {
                    <button type="button" (click)="form.urgency = u.value"
                      class="border-2 rounded-xl py-3 font-semibold text-sm transition"
                      [class.border-primary-500]="form.urgency === u.value"
                      [class.bg-primary-50]="form.urgency === u.value"
                      [class.text-primary-700]="form.urgency === u.value"
                      [class.border-ink-200]="form.urgency !== u.value"
                      [class.text-ink-600]="form.urgency !== u.value">
                      {{ u.label }}
                    </button>
                  }
                </div>
              </div>

              <label class="flex items-start gap-3 p-4 border-2 rounded-2xl cursor-pointer transition-all"
                [class.border-primary-500]="form.isForgotten"
                [class.bg-primary-50]="form.isForgotten"
                [class.border-ink-200]="!form.isForgotten">
                <input type="checkbox" name="isForgotten" [(ngModel)]="form.isForgotten" class="mt-1 w-5 h-5 rounded accent-primary-600" />
                <div>
                  <p class="font-semibold text-ink-900">Marcar como crisis olvidada</p>
                  <p class="text-sm text-ink-500 mt-0.5">Aparecerá destacado en la sección de crisis sin cobertura mediática</p>
                </div>
              </label>
            </div>
          </div>

          <!-- Meta -->
          <div class="bg-white rounded-3xl border border-ink-200 overflow-hidden shadow-soft">
            <div class="px-6 py-4 border-b border-ink-100 flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                <app-icon name="dollar" [size]="18" />
              </div>
              <div>
                <h2 class="font-bold text-ink-900">Meta de recaudación</h2>
                <p class="text-xs text-ink-500">¿Cuánto necesitas recaudar?</p>
              </div>
            </div>

            <div class="p-6">
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 font-bold text-lg">$</span>
                <input type="number" class="input pl-10 text-lg font-bold" name="goal" [(ngModel)]="form.goal" required min="1" />
              </div>
              <p class="text-xs text-ink-500 mt-2">USD. Ej: 50000</p>
            </div>
          </div>

          <!-- Botones -->
          <div class="flex flex-col sm:flex-row gap-3 sticky bottom-4 bg-ink-50 pt-4">
            <a routerLink="/manage/projects" class="btn-secondary flex-1 justify-center">
              Cancelar
            </a>
            <button type="submit" class="btn-primary flex-1 justify-center" [disabled]="saving() || f.invalid">
              @if (saving()) {
                Guardando...
              } @else {
                <app-icon name="check" [size]="18" />
                {{ isEdit() ? 'Guardar cambios' : 'Publicar proyecto' }}
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class ProjectFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(ProjectService);
  private uploadService = inject(UploadService);

  categories = signal<Category[]>([]);
  saving = signal(false);
  uploading = signal(false);
  uploadingGallery = signal(false);
  error = signal<string | null>(null);
  projectId = signal<number | null>(null);

  urgencies = [
    { value: 'LOW', label: 'Baja' },
    { value: 'MEDIUM', label: 'Media' },
    { value: 'HIGH', label: 'Alta' },
    { value: 'CRITICAL', label: 'Crítica' },
  ];

  form: any = {
    title: '',
    subtitle: '',
    description: '',
    impact: '',
    beneficiaries: null,
    country: '',
    region: '',
    urgency: 'MEDIUM',
    isForgotten: false,
    goal: 1000,
    imageUrl: '',
    gallery: [],
    categoryId: null,
  };

  ngOnInit() {
    this.service.categories().subscribe((c) => this.categories.set(c));

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.projectId.set(Number(id));
      this.service.getById(Number(id)).subscribe((p) => {
        this.form = {
          title: p.title,
          subtitle: p.subtitle || '',
          description: p.description,
          impact: p.impact || '',
          beneficiaries: p.beneficiaries || null,
          country: p.country,
          region: p.region || '',
          urgency: p.urgency,
          isForgotten: p.isForgotten,
          goal: Number(p.goal),
          imageUrl: p.imageUrl || '',
          gallery: p.gallery || [],
          categoryId: p.categoryId,
        };
      });
    }
  }

  isEdit(): boolean {
    return this.projectId() !== null;
  }

  onImageSelected(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;
    this.uploading.set(true);
    this.uploadService.uploadSingle(file).subscribe({
      next: (res) => { this.form.imageUrl = res.url; this.uploading.set(false); },
      error: () => { this.error.set('Error al subir imagen'); this.uploading.set(false); },
    });
  }

  onGallerySelected(event: any) {
    const files: File[] = Array.from(event.target.files || []);
    if (files.length === 0) return;
    this.uploadingGallery.set(true);
    this.uploadService.uploadMultiple(files).subscribe({
      next: (res) => {
        this.form.gallery = [...this.form.gallery, ...res.urls];
        this.uploadingGallery.set(false);
      },
      error: () => { this.error.set('Error al subir imágenes'); this.uploadingGallery.set(false); },
    });
  }

  removeGalleryImage(url: string) {
    this.form.gallery = this.form.gallery.filter((g: string) => g !== url);
  }

  save() {
    this.saving.set(true);
    this.error.set(null);

    const payload = {
      ...this.form,
      goal: Number(this.form.goal),
      beneficiaries: this.form.beneficiaries ? Number(this.form.beneficiaries) : undefined,
      categoryId: Number(this.form.categoryId),
    };

    const req = this.isEdit()
      ? this.service.update(this.projectId()!, payload)
      : this.service.create(payload);

    req.subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/manage/projects']);
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err.error?.message || 'Error al guardar');
      },
    });
  }
}