import { MigrationInterface, QueryRunner } from "typeorm";

export class LESSON1736913983749 implements MigrationInterface {
    name = 'LESSON1736913983749'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson" ADD "topic" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "topic"`);
    }

}
