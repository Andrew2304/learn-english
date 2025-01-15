import { ApiProperty } from '@nestjs/swagger';

export class CreateLessonDto {
  @ApiProperty()
  topic: string;

  @ApiProperty()
  words: string[];
}
