import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    <footer class="bg-ink-950 text-ink-400 border-t border-ink-800">
      <div class="max-w-7xl mx-auto px-6 py-16">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-10">

          <!-- Brand -->
          <div class="md:col-span-4">
            <div class="flex items-center gap-2.5 text-white font-extrabold text-lg mb-4">
              <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <app-icon name="globe" [size]="20" />
              </div>
              <span>Impacto<span class="text-primary-400">Visible</span></span>
            </div>
            <p class="text-sm leading-relaxed mb-6 max-w-xs text-ink-400">
              Plataforma de donaciones humanitarias enfocada en dar visibilidad a las crisis olvidadas del mundo.
            </p>
            <div class="flex items-center gap-2">
              <a href="#" class="w-9 h-9 rounded-lg bg-ink-800 hover:bg-primary-600 text-ink-300 hover:text-white flex items-center justify-center transition text-xs font-bold">f</a>
              <a href="#" class="w-9 h-9 rounded-lg bg-ink-800 hover:bg-primary-600 text-ink-300 hover:text-white flex items-center justify-center transition text-xs font-bold">x</a>
              <a href="#" class="w-9 h-9 rounded-lg bg-ink-800 hover:bg-primary-600 text-ink-300 hover:text-white flex items-center justify-center transition text-xs font-bold">in</a>
            </div>
          </div>

          <!-- Explorar -->
          <div class="md:col-span-2 md:col-start-6">
            <h4 class="text-white font-bold mb-5 text-xs uppercase tracking-[0.15em]">Explorar</h4>
            <ul class="space-y-3 text-sm">
              <li><a routerLink="/projects" class="text-ink-400 hover:text-white transition">Proyectos</a></li>
              <li><a routerLink="/dashboard" class="text-ink-400 hover:text-white transition">Dashboard</a></li>
              <li><a routerLink="/register" class="text-ink-400 hover:text-white transition">Ser donante</a></li>
            </ul>
          </div>

          <!-- Organizaciones -->
          <div class="md:col-span-2">
            <h4 class="text-white font-bold mb-5 text-xs uppercase tracking-[0.15em]">Organizaciones</h4>
            <ul class="space-y-3 text-sm">
              <li><a routerLink="/register" class="text-ink-400 hover:text-white transition">Registrar</a></li>
              <li><a routerLink="/manage/projects" class="text-ink-400 hover:text-white transition">Panel</a></li>
              <li><a routerLink="/manage/projects/new" class="text-ink-400 hover:text-white transition">Crear proyecto</a></li>
            </ul>
          </div>

          <!-- Legal -->
          <div class="md:col-span-2">
            <h4 class="text-white font-bold mb-5 text-xs uppercase tracking-[0.15em]">Legal</h4>
            <ul class="space-y-3 text-sm">
              <li><a href="#" class="text-ink-400 hover:text-white transition">Términos</a></li>
              <li><a href="#" class="text-ink-400 hover:text-white transition">Privacidad</a></li>
              <li><a href="#" class="text-ink-400 hover:text-white transition">Contacto</a></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Bottom -->
      <div class="border-t border-ink-800">
        <div class="max-w-7xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-3 text-xs text-ink-500">
          <p>© 2026 Impacto Visible · Hecho con dedicación para un mundo mejor</p>
          <p class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-success-500"></span>
            Todos los sistemas operativos
          </p>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}