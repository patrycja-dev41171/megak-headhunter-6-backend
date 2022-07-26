export interface UserEntity {
  id?: string;
  email: string;
  password?: string | null;
  role: string;
  registerToken?: string | null;
}
