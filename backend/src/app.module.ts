import { Module } from '@nestjs/common';
import { AnnouncementsController } from './announcements.contoller';
import { AnnouncementsService } from './announcements.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    // Remove ThrottlerModule.forRoot for now if causing errors
  ],
  controllers: [AnnouncementsController, AppController],
  providers: [AnnouncementsService],
})
export class AppModule {}