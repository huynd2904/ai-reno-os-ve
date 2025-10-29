import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1761722122839 implements MigrationInterface {
    name = 'AutoMigration1761722122839'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refreshtokens" DROP CONSTRAINT "UQ_b68c9d54cde8e3b5bc9f45d5e11"`);
        await queryRunner.query(`ALTER TABLE "refreshtokens" DROP COLUMN "username"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refreshtokens" ADD "username" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "refreshtokens" ADD CONSTRAINT "UQ_b68c9d54cde8e3b5bc9f45d5e11" UNIQUE ("username")`);
    }

}
