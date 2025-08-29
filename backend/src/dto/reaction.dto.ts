import { IsString, IsIn } from 'class-validator';

export class CreateReactionDto {
  @IsString()
  @IsIn(['up', 'down', 'heart'])
  type!: 'up' | 'down' | 'heart';
}
