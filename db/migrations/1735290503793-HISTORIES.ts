import { MigrationInterface, QueryRunner } from "typeorm";

export class HISTORIES1735290503793 implements MigrationInterface {
    name = 'HISTORIES1735290503793'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "history" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "word_id" integer NOT NULL, "user_id" integer NOT NULL, "count" integer NOT NULL DEFAULT '1', "type" text NOT NULL, "description" text, CONSTRAINT "PK_9384942edf4804b38ca0ee51416" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "history_detail" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "history_id" integer NOT NULL, CONSTRAINT "PK_9f69737bb82887f370d86110eb3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "history_detail"`);
        await queryRunner.query(`DROP TABLE "history"`);
    }

}
