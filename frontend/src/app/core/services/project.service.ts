import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Category, Project, ProjectListResponse } from '../models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  constructor(private api: ApiService) {}

  list(params: {
    page?: number;
    limit?: number;
    category?: string;
    country?: string;
    forgotten?: boolean;
    search?: string;
    urgency?: string;
  }) {
    const cleaned: any = {};
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') cleaned[k] = v;
    });
    return this.api.get<ProjectListResponse>('/projects', cleaned);
  }

  getById(id: number) {
    return this.api.get<Project>(`/projects/${id}`);
  }

  create(data: Partial<Project>) {
    return this.api.post<Project>('/projects', data);
  }

  update(id: number, data: Partial<Project>) {
    return this.api.put<Project>(`/projects/${id}`, data);
  }

  remove(id: number) {
    return this.api.delete<void>(`/projects/${id}`);
  }

  mine() {
    return this.api.get<Project[]>('/projects/mine');
  }

  categories() {
    return this.api.get<Category[]>('/categories');
  }
}