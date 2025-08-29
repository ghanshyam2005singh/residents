import { Injectable, NotFoundException } from '@nestjs/common';
import { Announcement } from './announcements.model';

@Injectable()
export class AnnouncementsService {
  private announcements: Announcement[] = [];

  create(title: string, description?: string): Announcement {
    const announcement: Announcement = {
      id: (Date.now() + Math.random()).toString(),
      title,
      description,
      status: 'active',
      createdAt: new Date(),
    };
    this.announcements.unshift(announcement);
    return announcement;
  }

  findAll(): Announcement[] {
    return [...this.announcements];
  }

  updateStatus(id: string, status: 'active' | 'closed'): Announcement {
    const announcement = this.announcements.find((a) => a.id === id);
    if (!announcement) throw new NotFoundException('Announcement not found');
    announcement.status = status;
    return announcement;
  }
}
