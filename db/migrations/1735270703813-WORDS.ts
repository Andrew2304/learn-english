import { MigrationInterface, QueryRunner } from 'typeorm';

export class WORDS1735270703813 implements MigrationInterface {
  name = 'WORDS1735270703813';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "word" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" text NOT NULL, "type" text, "pronunciation" text, "translation" text, "pronunciation_link" text, "is_active" boolean NOT NULL DEFAULT true, "is_verify" boolean NOT NULL DEFAULT false, "example" text, "example_translation" text, "description" text, "order_number" integer NOT NULL DEFAULT '100', CONSTRAINT "UNIQUE_WORD" UNIQUE ("name", "deleted_at"), CONSTRAINT "PK_ad026d65e30f80b7056ca31f666" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "word"`);
  }
}
