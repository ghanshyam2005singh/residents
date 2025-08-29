export interface Announcement {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'closed';
  createdAt: string;
  lastActivityAt: string;
  comments: Comment[];
  reactions: Reaction[];
}

export interface Comment {
  id: string;
  authorName: string;
  text: string;
  createdAt: string;
}

export type ReactionType = 'up' | 'down' | 'heart';

export interface Reaction {
  id: string;
  userId: string;
  type: ReactionType;
  createdAt: string;
  idempotencyKey?: string;
}

export interface AnnouncementRepository {
  getAll(): Announcement[];
  getById(id: string): Announcement | undefined;
  add(announcement: Announcement): void;
  update(announcement: Announcement): void;
  // Comments
  addComment(announcementId: string, comment: Comment): void;
  getComments(
    announcementId: string,
    cursor?: string,
    limit?: number,
  ): Comment[];
  // Reactions
  addReaction(announcementId: string, reaction: Reaction): void;
  removeReaction(announcementId: string, userId: string): void;
  getReactions(announcementId: string): Reaction[];
}
