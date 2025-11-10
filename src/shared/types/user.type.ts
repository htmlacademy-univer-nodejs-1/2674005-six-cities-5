import { UserType } from './user-type.enum.js';

export type User = {
  email: string;
  name: string;
  lastName: string;
  password: string;
  avatarUrl: string;
  type: UserType;
};
