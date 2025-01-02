import { PartialType } from '@nestjs/mapped-types';
import { CreateWordDto } from './create-word.dto';

export class UpdateWordDto extends PartialType(CreateWordDto) {
  pronunciationLink: string | null;
  isActive: boolean;
  isVerify: boolean;
  example: string | null;
  exampleTranslation: string | null;
  description: string | null;
  orderNumber: number;
}
