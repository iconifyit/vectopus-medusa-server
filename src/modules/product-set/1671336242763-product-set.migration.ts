import { MigrationInterface, QueryRunner } from 'typeorm';
import { Migration } from 'medusa-extender';

@Migration()
export class ProductSetMigration1671336242763 implements MigrationInterface {
    name = 'Product-setMigration1671336242763';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "product_set" (
                "id" character varying PRIMARY KEY,
                "title" character varying NOT NULL,
                "description" character varying,
                "handle" character varying,
                "metadata" jsonb,
                "thumbnail" character varying,
                "collection_id" character varying REFERENCES product_collection(id),
                "type_id" character varying REFERENCES product_type(id),
                "store_id" text,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP WITH TIME ZONE
            );
            CREATE UNIQUE INDEX "PK_product_set" ON "product_set"(id text_ops);
            CREATE UNIQUE INDEX "IDX_product_set" ON "product_set" (handle text_ops) WHERE deleted_at IS NULL;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE IF EXISTS "product_set";
        `);
    }
}