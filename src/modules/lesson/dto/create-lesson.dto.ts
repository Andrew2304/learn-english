import { ApiProperty } from '@nestjs/swagger';

export class CreateLessonDto {
  @ApiProperty()
  topic: string;

  @ApiProperty()
  words: {
    description: string;
    type?: string;
    pronunciation?: string;
    translation?: string;
  }[];
}
