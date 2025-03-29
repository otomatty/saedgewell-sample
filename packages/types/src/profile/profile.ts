import type { UserRole } from '../auth/auth';

export interface Profile {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
  role: UserRole;
  isAdmin: boolean;
}

export interface ProfileWithRole extends Profile {
  roles: UserRole[];
}
