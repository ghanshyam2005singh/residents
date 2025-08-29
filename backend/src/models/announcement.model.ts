export type Status = 'active' | 'closed';
export type ReactionType = 'up' | 'down' | 'heart';

export interface Comment {
  id: string;
  authorName: string;
  text: string;
  createdAt: string;
}

export interface Reaction {
  id: string;
  userId: string;
  type: ReactionType;
  createdAt: string;
  idempotencyKey?: string;
}

export interface Announcement {
  id: string;
  title: string;
  description?: string;
  status: Status;
  createdAt: string;
  lastActivityAt: string;
  comments: Comment[];
  reactions: Reaction[];
}
