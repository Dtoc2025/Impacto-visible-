export interface Donation {
  id: number;
  amount: number;
  message?: string;
  isAnonymous: boolean;
  userId: number;
  projectId: number;
  createdAt: string;
  project?: {
    id: number;
    title: string;
    country: string;
    imageUrl?: string;
  };
  user?: { id: number; name: string; avatarUrl?: string } | null;
}