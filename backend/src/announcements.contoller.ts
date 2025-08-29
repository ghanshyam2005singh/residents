import { Headers } from '@nestjs/common';
import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  NotFoundException,
  Query,
  Delete,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import {
  CreateAnnouncementDto,
  UpdateAnnouncementStatusDto,
} from './announcement.dto';
import type { Announcement } from './models/announcement.model';
import { CreateCommentDto } from './dto/comment.dto';
import { CreateReactionDto } from './dto/reaction.dto';
import { InMemoryAnnouncementRepository } from './repositories/in-memory-announcement.repository';

const repo = new InMemoryAnnouncementRepository();

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly service: AnnouncementsService) {}

  @Post()
  create(@Body() dto: CreateAnnouncementDto): Announcement {
    const announcement = this.service.create(dto.title, dto.description);
    if (typeof announcement.createdAt === 'string') {
      announcement.createdAt = new Date(announcement.createdAt).toISOString();
    }
    return announcement;
  }

  @Get()
  findAll(): Announcement[] {
    return this.service.findAll();
  }

  @Patch(':id')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateAnnouncementStatusDto,
  ): Announcement {
    const updated = this.service.updateStatus(id, dto.status);
    if (!updated) {
      throw new NotFoundException('Announcement not found');
    }
    return updated;
  }

  @Post(':id/comments')
  addComment(@Param('id') id: string, @Body() dto: CreateCommentDto) {
    const comment = {
      id: Date.now().toString(),
      authorName: dto.authorName,
      text: dto.text,
      createdAt: new Date().toISOString(),
    };
    repo.addComment(id, comment);
    return { success: true, comment };
  }

  @Get(':id/comments')
  getComments(
    @Param('id') id: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    const comments = repo.getComments(id, cursor, limit ? parseInt(limit) : 10);
    return { comments };
  }

  @Post(':id/reactions')
  addReaction(
    @Param('id') id: string,
    @Body() dto: CreateReactionDto,
    @Headers('x-user-id') userId: string,
    @Headers('idempotency-key') idempotencyKey: string,
  ) {
    if (!userId) {
      return { code: 'USER_ID_REQUIRED', message: 'x-user-id header required' };
    }
    const reaction = {
      id: Date.now().toString(),
      userId,
      type: dto.type,
      createdAt: new Date().toISOString(),
      idempotencyKey,
    };
    // TODO: Implement idempotency logic in repo
    repo.addReaction(id, reaction);
    return { success: true, reaction };
  }

  @Delete(':id/reactions')
  removeReaction(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string,
  ) {
    if (!userId) {
      return { code: 'USER_ID_REQUIRED', message: 'x-user-id header required' };
    }
    repo.removeReaction(id, userId);
    return { success: true };
  }
}
