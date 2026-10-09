import { Routes } from '@angular/router';
import { authGuard, orgGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent) },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'projects', loadComponent: () => import('./features/projects/project-list/project-list.component').then(m => m.ProjectListComponent) },
  { path: 'projects/:id', loadComponent: () => import('./features/projects/project-detail/project-detail.component').then(m => m.ProjectDetailComponent) },
  { path: 'projects/:id/donate', canActivate: [authGuard], loadComponent: () => import('./features/donations/donation-form/donation-form.component').then(m => m.DonationFormComponent) },
  { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'my-donations', canActivate: [authGuard], loadComponent: () => import('./features/donations/my-donations/my-donations.component').then(m => m.MyDonationsComponent) },
  { path: 'profile', canActivate: [authGuard], loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'manage/projects', canActivate: [orgGuard], loadComponent: () => import('./features/manage/manage-projects/manage-projects.component').then(m => m.ManageProjectsComponent) },
  { path: 'manage/projects/new', canActivate: [orgGuard], loadComponent: () => import('./features/manage/project-form/project-form.component').then(m => m.ProjectFormComponent) },
  { path: 'manage/projects/:id/edit', canActivate: [orgGuard], loadComponent: () => import('./features/manage/project-form/project-form.component').then(m => m.ProjectFormComponent) },
  { path: '**', redirectTo: '' },
];