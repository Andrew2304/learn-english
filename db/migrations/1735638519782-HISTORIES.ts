import { MigrationInterface, QueryRunner } from "typeorm";

export class HISTORIES1735638519782 implements MigrationInterface {
    name = 'HISTORIES1735638519782'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "history" ADD CONSTRAINT "FK_c9e5255b31e0656244e70305e8e" FOREIGN KEY ("word_id") REFERENCES "word"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "history" DROP CONSTRAINT "FK_c9e5255b31e0656244e70305e8e"`);
    }

}
