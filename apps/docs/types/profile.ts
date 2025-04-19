export interface Profile {
  id: string;
  fullName: string | null;
  avatarUrl: string | null;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileWithRole extends Profile {
  isAdmin: boolean;
}
