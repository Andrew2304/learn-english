import { ApiProperty } from '@nestjs/swagger';

export class CreateHistoryDto {
  @ApiProperty()
  wordId: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  description?: string;
}
