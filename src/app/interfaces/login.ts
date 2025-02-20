export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  __v: number;
}

export interface login {
  email: string;
  password: string;
}
