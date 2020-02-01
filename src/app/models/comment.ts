import { User } from './user';

export class Comment {
  id: number;
  body: string;
  createdAt: number;
  updatedAt: number;
  creator: User;
  system: boolean;
}
