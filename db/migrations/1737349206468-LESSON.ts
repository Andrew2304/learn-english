import { MigrationInterface, QueryRunner } from 'typeorm';

export class LESSON1737349206468 implements MigrationInterface {
  name = 'LESSON1737349206468';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lesson_word" ADD CONSTRAINT "FK_4f0b2c4f14c5529d83b7e5e9c94" FOREIGN KEY ("lesson_id") REFERENCES "lesson"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lesson_word" DROP CONSTRAINT "FK_4f0b2c4f14c5529d83b7e5e9c94"`,
    );
  }
}
