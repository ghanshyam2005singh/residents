import { Module } from '@nestjs/common';
import { AnnouncementsController } from './announcements.contoller';
import { AnnouncementsService } from './announcements.service';

@Module({
  imports: [],
  controllers: [AnnouncementsController],
  providers: [AnnouncementsService],
})
export class AppModule {}
