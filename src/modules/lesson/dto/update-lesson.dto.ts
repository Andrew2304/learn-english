import { ApiProperty } from '@nestjs/swagger';
import { EQuestionType } from '../../../helpers';

export class UpdateLessonDto {
  @ApiProperty()
  contents: ContentDTO[];
}

class ContentDTO {
  @ApiProperty()
  lessonWordId: number;
  @ApiProperty()
  type: EQuestionType;
  @ApiProperty()
  question: string | null;
  @ApiProperty()
  answer: string | null;
}
