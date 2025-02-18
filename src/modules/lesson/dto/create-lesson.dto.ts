import { ApiProperty } from '@nestjs/swagger';

export class CreateLessonDto {
  @ApiProperty()
  topic: string;

  @ApiProperty()
  words: {
    id?: number;
    description: string;
    type?: string;
    pronunciation?: string;
    pronunciationLink?: string;
    translation?: string;
  }[];

  @ApiProperty()
  description?: string;
}

export class CreateSampleDto {
  @ApiProperty()
  text: string;
}
