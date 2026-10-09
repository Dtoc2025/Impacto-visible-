import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Donation } from '../models/donation.model';

@Injectable({ providedIn: 'root' })
export class DonationService {
  constructor(private api: ApiService) {}

  create(data: { amount: number; message?: string; isAnonymous: boolean; projectId: number }) {
    return this.api.post<Donation>('/donations', data);
  }

  myDonations() {
    return this.api.get<Donation[]>('/donations/me');
  }

  byProject(projectId: number) {
    return this.api.get<Donation[]>(`/donations/project/${projectId}`);
  }
}