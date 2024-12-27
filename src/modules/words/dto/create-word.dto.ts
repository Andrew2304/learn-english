import { ApiProperty } from '@nestjs/swagger';

export class CreateWordDto {
  name: string;
  type: string | null;
  pronunciation: string | null;
  translation: string | null;
  // pronunciationLink: string | null;
  // isActive: boolean;
  // isVerify: boolean;
  // example: string | null;
  // exampleTranslation: string | null;
  // description: string | null;
  // orderNumber: number;
}
