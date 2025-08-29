import {
  Announcement,
  AnnouncementRepository,
  Comment,
  Reaction,
  ReactionType,
} from './announcement.repository';

const IDEMPOTENCY_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

export class InMemoryAnnouncementRepository implements AnnouncementRepository {
  private announcements: Announcement[] = [];

  getAll(): Announcement[] {
    return [...this.announcements];
  }

  getById(id: string): Announcement | undefined {
    return this.announcements.find((a) => a.id === id);
  }

  add(announcement: Announcement): void {
    this.announcements.unshift(announcement);
  }

  update(announcement: Announcement): void {
    const idx = this.announcements.findIndex((a) => a.id === announcement.id);
    if (idx !== -1) {
      this.announcements[idx] = announcement;
    }
  }

  addComment(announcementId: string, comment: Comment): void {
    const announcement = this.getById(announcementId);
    if (announcement) {
      announcement.comments.unshift(comment);
      announcement.lastActivityAt = comment.createdAt;
    }
  }

  getComments(
    announcementId: string,
    cursor?: string,
    limit: number = 10,
  ): Comment[] {
    const announcement = this.getById(announcementId);
    if (!announcement) return [];
    let comments = announcement.comments;
    if (cursor) {
      const idx = comments.findIndex((c) => c.id === cursor);
      if (idx !== -1) {
        comments = comments.slice(idx + 1);
      }
    }
    return comments.slice(0, limit);
  }

  addReaction(announcementId: string, reaction: Reaction): void {
    const announcement = this.getById(announcementId);
    if (announcement) {
      const now = Date.now();

      // Clean up old reactions with idempotencyKey
      announcement.reactions = announcement.reactions.filter((r) => {
        if (!r.idempotencyKey) return true;
        return now - new Date(r.createdAt).getTime() < IDEMPOTENCY_WINDOW_MS;
      });

      // Check for duplicate idempotencyKey within 5 min
      if (
        reaction.idempotencyKey &&
        announcement.reactions.some(
          (r) =>
            r.idempotencyKey === reaction.idempotencyKey &&
            now - new Date(r.createdAt).getTime() < IDEMPOTENCY_WINDOW_MS,
        )
      ) {
        // Ignore duplicate
        return;
      }

      // Remove previous reaction from same user
      announcement.reactions = announcement.reactions.filter(
        (r) => r.userId !== reaction.userId,
      );
      announcement.reactions.push(reaction);
      announcement.lastActivityAt = reaction.createdAt;
    }
  }

  removeReaction(announcementId: string, userId: string): void {
    const announcement = this.getById(announcementId);
    if (announcement) {
      announcement.reactions = announcement.reactions.filter(
        (r) => r.userId !== userId,
      );
      announcement.lastActivityAt = new Date().toISOString();
    }
  }

  getReactions(announcementId: string): Reaction[] {
    const announcement = this.getById(announcementId);
    return announcement ? [...announcement.reactions] : [];
  }
}
