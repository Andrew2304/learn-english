import { MigrationInterface, QueryRunner } from 'typeorm';

export class LESSON1737348941372 implements MigrationInterface {
  name = 'LESSON1737348941372';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lesson_word" DROP CONSTRAINT "FK_83efedca5e28bc7aea9bcd3d47a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_word" DROP CONSTRAINT "REL_83efedca5e28bc7aea9bcd3d47"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_word" ADD CONSTRAINT "FK_83efedca5e28bc7aea9bcd3d47a" FOREIGN KEY ("word_id") REFERENCES "word"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lesson_word" DROP CONSTRAINT "FK_83efedca5e28bc7aea9bcd3d47a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_word" ADD CONSTRAINT "REL_83efedca5e28bc7aea9bcd3d47" UNIQUE ("word_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_word" ADD CONSTRAINT "FK_83efedca5e28bc7aea9bcd3d47a" FOREIGN KEY ("word_id") REFERENCES "word"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
