import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementStatusDto } from './dto/update-announcement-status.dto';
import { Announcement } from './interfaces/announcement.interface';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Get()
  findAll(): Announcement[] {
    return this.announcementsService.findAll();
  }

  @Post()
  create(@Body() createAnnouncementDto: CreateAnnouncementDto): Announcement {
    return this.announcementsService.create(createAnnouncementDto);
  }

  @Patch(':id')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateAnnouncementStatusDto,
  ): Announcement {
    return this.announcementsService.updateStatus(id, updateStatusDto);
  }
}