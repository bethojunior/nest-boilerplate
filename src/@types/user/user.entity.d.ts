export interface UserEntity {
  id: string;
  name: string;
  email: string;
  nickname: string;
  phone: string;
  isActive: boolean;

  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}