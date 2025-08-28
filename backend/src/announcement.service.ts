import { Injectable, NotFoundException } from '@nestjs/common';
import { Announcement, Status } from './interfaces/announcement.interface';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementStatusDto } from './dto/update-announcement-status.dto';

@Injectable()
export class AnnouncementsService {
  private announcements: Announcement[] = [];

  findAll(): Announcement[] {
    // Return announcements sorted by creation date (newest first)
    return this.announcements.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  create(createAnnouncementDto: CreateAnnouncementDto): Announcement {
    const announcement: Announcement = {
      id: Date.now().toString(),
      title: createAnnouncementDto.title,
      description: createAnnouncementDto.description,
      status: 'active' as Status,
      createdAt: new Date().toISOString(),
    };

    this.announcements.push(announcement);
    return announcement;
  }

  updateStatus(id: string, updateStatusDto: UpdateAnnouncementStatusDto): Announcement {
    const announcementIndex = this.announcements.findIndex(a => a.id === id);
    
    if (announcementIndex === -1) {
      throw new NotFoundException(`Announcement with ID ${id} not found`);
    }

    this.announcements[announcementIndex].status = updateStatusDto.status as Status;
    return this.announcements[announcementIndex];
  }
}