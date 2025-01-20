import { MigrationInterface, QueryRunner } from 'typeorm';

export class LESSON1736911639808 implements MigrationInterface {
  name = 'LESSON1736911639808';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "lesson_word" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "lesson_id" integer NOT NULL, "word_id" integer NOT NULL, "description" text, CONSTRAINT "REL_83efedca5e28bc7aea9bcd3d47" UNIQUE ("word_id"), CONSTRAINT "PK_0a7e96039ce5bef5fa6d25ec14e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "lesson" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" integer NOT NULL, "title" text NOT NULL, "count" integer NOT NULL DEFAULT '1', "description" text, CONSTRAINT "PK_0ef25918f0237e68696dee455bd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "lesson_answer" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "question_id" integer NOT NULL, "answer" text, "description" text, CONSTRAINT "REL_2393f5b81c194d04377b4247c7" UNIQUE ("question_id"), CONSTRAINT "PK_87b904c7ec4b432fc44f8c55398" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."lesson_question_type_enum" AS ENUM('When', 'Where', 'Who', 'Why', 'What')`,
    );
    await queryRunner.query(
      `CREATE TABLE "lesson_question" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "lesson_word_id" integer NOT NULL, "type" "public"."lesson_question_type_enum" NOT NULL, "question" text, "description" text, CONSTRAINT "PK_c96594730ed52da2cfb92168902" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_word" ADD CONSTRAINT "FK_4f0b2c4f14c5529d83b7e5e9c94" FOREIGN KEY ("lesson_id") REFERENCES "lesson"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_word" ADD CONSTRAINT "FK_83efedca5e28bc7aea9bcd3d47a" FOREIGN KEY ("word_id") REFERENCES "word"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_answer" ADD CONSTRAINT "FK_2393f5b81c194d04377b4247c70" FOREIGN KEY ("question_id") REFERENCES "lesson_question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_question" ADD CONSTRAINT "FK_b31a52da796d3e4f2434b05b42f" FOREIGN KEY ("lesson_word_id") REFERENCES "lesson_word"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lesson_question" DROP CONSTRAINT "FK_b31a52da796d3e4f2434b05b42f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_answer" DROP CONSTRAINT "FK_2393f5b81c194d04377b4247c70"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_word" DROP CONSTRAINT "FK_83efedca5e28bc7aea9bcd3d47a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_word" DROP CONSTRAINT "FK_4f0b2c4f14c5529d83b7e5e9c94"`,
    );
    await queryRunner.query(`DROP TABLE "lesson_question"`);
    await queryRunner.query(`DROP TYPE "public"."lesson_question_type_enum"`);
    await queryRunner.query(`DROP TABLE "lesson_answer"`);
    await queryRunner.query(`DROP TABLE "lesson"`);
    await queryRunner.query(`DROP TABLE "lesson_word"`);
  }
}
