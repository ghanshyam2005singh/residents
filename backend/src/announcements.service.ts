import { Injectable, NotFoundException } from '@nestjs/common';
import { Announcement } from './models/announcement.model';
import { InMemoryAnnouncementRepository } from './repositories/in-memory-announcement.repository';
import { CreateCommentDto } from './dto/comment.dto';
import { CreateReactionDto } from './dto/reaction.dto';

@Injectable()
export class AnnouncementsService {
  private repo = new InMemoryAnnouncementRepository();

  create(title: string, description?: string): Announcement {
    const now = new Date().toISOString();
    const announcement: Announcement = {
      id: (Date.now() + Math.random()).toString(),
      title,
      description,
      status: 'active',
      createdAt: now,
      lastActivityAt: now,
      comments: [],
      reactions: [],
    };
    this.repo.add(announcement);
    return announcement;
  }

  findAll(): Announcement[] {
    return this.repo.getAll();
  }

  updateStatus(id: string, status: 'active' | 'closed'): Announcement {
    const announcement = this.repo.getById(id);
    if (!announcement) throw new NotFoundException('Announcement not found');
    announcement.status = status;
    this.repo.update(announcement);
    return announcement;
  }

  addComment(id: string, dto: CreateCommentDto) {
    const comment = {
      id: Date.now().toString(),
      authorName: dto.authorName,
      text: dto.text,
      createdAt: new Date().toISOString(),
    };
    this.repo.addComment(id, comment);
    return comment;
  }

  getComments(id: string, cursor?: string, limit?: number) {
    return this.repo.getComments(id, cursor, limit ?? 10);
  }

  addReaction(
    id: string,
    dto: CreateReactionDto,
    userId: string,
    idempotencyKey?: string,
  ) {
    const reaction = {
      id: Date.now().toString(),
      userId,
      type: dto.type,
      createdAt: new Date().toISOString(),
      idempotencyKey,
    };
    this.repo.addReaction(id, reaction);
    return reaction;
  }

  removeReaction(id: string, userId: string) {
    this.repo.removeReaction(id, userId);
  }
}
