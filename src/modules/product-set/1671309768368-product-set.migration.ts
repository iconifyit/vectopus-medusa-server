import { MigrationInterface, QueryRunner } from 'typeorm';
import { Migration } from 'medusa-extender';

@Migration()
export class alterProductAddSetId1671309768368 implements MigrationInterface {
    name = 'alterProductAddSetId1671309768368';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        const query = `
            ALTER TABLE public."product"
            ADD COLUMN IF NOT EXISTS "set_id" text;
        `;
        await queryRunner.query(query);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        const query = `
            ALTER TABLE public."product"
            DROP COLUMN "set_id";
        `;
        await queryRunner.query(query);
    }
}