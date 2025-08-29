import { IsString, IsOptional, IsIn } from 'class-validator';

export class CreateAnnouncementDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateAnnouncementStatusDto {
  @IsIn(['active', 'closed'])
  status: 'active' | 'closed';
}
