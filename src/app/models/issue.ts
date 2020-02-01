import { User } from './user';
import { Attachment } from './attachment';

export class Issue {
  assignee: User;
  attachmentList: Attachment[];
  createdAt: number;
  creator: User;
  description: string;
  id: number;
  issueType: string;
  priority: string;
  status: string;
  title: string;
  updatedAt: number;
  votes: number;
  watchers: number;
}
