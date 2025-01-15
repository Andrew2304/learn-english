import { MigrationInterface, QueryRunner } from "typeorm";

export class LESSON1736913457066 implements MigrationInterface {
    name = 'LESSON1736913457066'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson_word" DROP CONSTRAINT "FK_83efedca5e28bc7aea9bcd3d47a"`);
        await queryRunner.query(`ALTER TABLE "lesson_word" ALTER COLUMN "word_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lesson_word" ADD CONSTRAINT "FK_83efedca5e28bc7aea9bcd3d47a" FOREIGN KEY ("word_id") REFERENCES "word"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson_word" DROP CONSTRAINT "FK_83efedca5e28bc7aea9bcd3d47a"`);
        await queryRunner.query(`ALTER TABLE "lesson_word" ALTER COLUMN "word_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lesson_word" ADD CONSTRAINT "FK_83efedca5e28bc7aea9bcd3d47a" FOREIGN KEY ("word_id") REFERENCES "word"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
