import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import {
  CreateAnnouncementDto,
  UpdateAnnouncementStatusDto,
} from './announcement.dto';
import type { Announcement } from './announcements.model';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly service: AnnouncementsService) {}

  @Post()
  create(@Body() dto: CreateAnnouncementDto): Announcement {
    return this.service.create(dto.title, dto.description);
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
}