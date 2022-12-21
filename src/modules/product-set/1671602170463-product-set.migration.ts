import { MigrationInterface, QueryRunner } from 'typeorm';
import { Migration } from 'medusa-extender';

@Migration()
export class ProductSetMigration1671602170463 implements MigrationInterface {
    name = 'addDiscountConditionProductSetTable1671602170463';
    
    // public async up2(queryRunner: QueryRunner): Promise<void> {
    //     await queryRunner.query(`
    //         CREATE TABLE IF NOT EXISTS "product_set" (
    //             "id" character varying PRIMARY KEY,
    //             "title" character varying NOT NULL,
    //             "description" character varying,
    //             "handle" character varying,
    //             "metadata" jsonb,
    //             "thumbnail" character varying,
    //             "collection_id" character varying REFERENCES product_collection(id),
    //             "type_id" character varying REFERENCES product_type(id),
    //             "store_id" text,
    //             "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    //             "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    //             "deleted_at" TIMESTAMP WITH TIME ZONE
    //         );
    //         CREATE UNIQUE INDEX "PK_product_set" ON "product_set" (id text_ops);
    //         CREATE UNIQUE INDEX "IDX_product_set" ON "product_set" (handle text_ops) WHERE deleted_at IS NULL;
    //     `)
    // }

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "discount_condition_product_set" (
                "product_set_id" character varying REFERENCES product_set(id) ON DELETE CASCADE,
                "condition_id" character varying REFERENCES discount_condition(id) ON DELETE CASCADE,
                "created_at" timestamp with time zone NOT NULL DEFAULT now(),
                "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
                "metadata" jsonb,
                CONSTRAINT "PK_product_set_to_condition" PRIMARY KEY ("product_set_id", "condition_id")
            );
            CREATE UNIQUE INDEX "PK_product_set_condition" ON "discount_condition_product_set" (product_set_id text_ops, condition_id text_ops);
            CREATE INDEX "IDX_discount_condition_product_set_cid" ON "discount_condition_product_set" (condition_id text_ops);
            CREATE INDEX "IDX_discount_condition_product_set_psid" ON "discount_condition_product_set" (product_set_id text_ops);
        `);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE IF EXISTS discount_condition_product_set');
    }
}