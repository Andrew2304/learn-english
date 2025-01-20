import { MigrationInterface, QueryRunner } from 'typeorm';

export class LESSON1737363145915 implements MigrationInterface {
  name = 'LESSON1737363145915';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lesson_word" ADD "count" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lesson_word" DROP COLUMN "count"`);
  }
}
