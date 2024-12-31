import { MigrationInterface, QueryRunner } from "typeorm";

export class HISTORIES1735636944151 implements MigrationInterface {
    name = 'HISTORIES1735636944151'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "history_detail" ADD "description" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "history_detail" DROP COLUMN "description"`);
    }

}
