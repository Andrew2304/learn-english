import { MigrationInterface, QueryRunner } from 'typeorm';

export class LESSON1737447007569 implements MigrationInterface {
  name = 'LESSON1737447007569';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lesson_word" ADD "pronunciation_link" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_question" ADD "pronunciation_link" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lesson_question" DROP COLUMN "pronunciation_link"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_word" DROP COLUMN "pronunciation_link"`,
    );
  }
}
