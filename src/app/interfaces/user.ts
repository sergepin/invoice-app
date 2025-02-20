export interface user {
  name: string;
  email: string;
  password: string;
  role: 'user'; // Explicitly defining 'user' as the only allowed value
}
