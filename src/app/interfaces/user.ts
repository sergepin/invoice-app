export interface user {
  name: string;
  email: string;
  password: string;
  role: 'user';
}

export interface manageUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'user';
}
