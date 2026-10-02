// types/user.ts
export interface User {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: "artisan" | "client" | string;
}

export interface UserProps {
  user?: User;
}