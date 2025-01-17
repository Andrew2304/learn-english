import { MigrationInterface, QueryRunner } from 'typeorm';

export class LESSON1737086211790 implements MigrationInterface {
  name = 'LESSON1737086211790';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lesson_word" ADD "type" text`);
    await queryRunner.query(
      `ALTER TABLE "lesson_word" ADD "pronunciation" text`,
    );
    await queryRunner.query(`ALTER TABLE "lesson_word" ADD "translation" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lesson_word" DROP COLUMN "translation"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_word" DROP COLUMN "pronunciation"`,
    );
    await queryRunner.query(`ALTER TABLE "lesson_word" DROP COLUMN "type"`);
  }
}
