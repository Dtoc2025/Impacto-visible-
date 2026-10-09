import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

export interface DashboardStats {
  totalRaised: number;
  totalDonations: number;
  activeProjects: number;
  totalUsers: number;
}

export interface CategoryStat {
  category: string;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private api: ApiService) {}

  stats() {
    return this.api.get<DashboardStats>('/dashboard/stats');
  }

  byCategory() {
    return this.api.get<CategoryStat[]>('/dashboard/by-category');
  }
}