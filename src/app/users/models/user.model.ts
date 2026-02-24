export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export interface IUser {
  id: string;
  email: string;
  isActive: boolean;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}
