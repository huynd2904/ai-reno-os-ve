import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1761712748700 implements MigrationInterface {
    name = 'AutoMigration1761712748700'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying, "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "avatar" character varying, "lastLogin" TIMESTAMP, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_450a05c0c4de5b75ac8d34835b9" UNIQUE ("password"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "refreshtokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "accessToken" character varying NOT NULL, "refreshToken" character varying NOT NULL, "username" character varying NOT NULL, "isUsed" boolean NOT NULL DEFAULT false, "IsRevoked" boolean NOT NULL DEFAULT false, "addedDate" TIMESTAMP NOT NULL, "expiryTime" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_b68c9d54cde8e3b5bc9f45d5e11" UNIQUE ("username"), CONSTRAINT "PK_87227f9dbc6460359fd991d66ce" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "refreshtokens"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
