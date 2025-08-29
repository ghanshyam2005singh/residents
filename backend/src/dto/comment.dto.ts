import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  authorName!: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 500)
  text!: string;
}
