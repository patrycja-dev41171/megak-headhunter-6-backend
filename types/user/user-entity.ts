export interface UserEntity {
  user_id?: string;
  email: string;
  password: string | null;
  role: string;
  registerToken?: string | null;
}
