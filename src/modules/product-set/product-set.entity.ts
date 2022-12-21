import {
    BeforeInsert,
    Column,
    Entity,
    Index,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm"
import { Entity as MedusaEntity } from "medusa-extender";
import {
    generateEntityId,
    ProductCollection,
    SoftDeletableEntity,
    Image,
    ProductType,
    ProductTag,
    Product,
} from "@medusajs/medusa/dist"
import { DbAwareColumn, resolveDbType } from "@medusajs/medusa/dist/utils/db-aware-column"
import _ from "lodash"
import { Store } from "medusa-marketplace/dist/modules/store/store.entity";
// import Product from '../product/product.entity';


@MedusaEntity()
@Entity()
export class ProductSet extends SoftDeletableEntity {
    @Index({ unique: true, where: "deleted_at IS NULL" })
    @Column({ nullable: true })
    handle: string

    @PrimaryColumn()
    id: string

    @Column()
    title: string;

    @Index()
    @Column({ nullable: false })
    store_id: string;

    @ManyToOne(() => Store, (store) => store.members)
    @JoinColumn({ name: "store_id", referencedColumnName: "id" })
    store: Store;

    @ManyToMany(() => ProductTag)
    @JoinTable({
        name: "product_tags",
        joinColumn: {
            name: "product_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "product_tag_id",
            referencedColumnName: "id",
        },
    })
    tags: ProductTag[]

    @ManyToMany(() => Image, { cascade: ["insert"] })
    @JoinTable({
        name: "set_images",
        joinColumn: {
            name: "set_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "image_id",
            referencedColumnName: "id",
        },
    })
    images: Image[]

    @Column({ type: "text", nullable: true })
    thumbnail: string | null

    @Column({ type: "text", nullable: true })
    description: string | null

    @Column()
    license: string;

    @Column()
    isActive: boolean;

    @ManyToOne(() => ProductType)
    @JoinColumn({ name: "type_id" })
    type: ProductType

    @Column({ type: "text", nullable: true })
    type_id: string | null

    @Column({ type: "text", nullable: true })
    collection_id: string | null

    @ManyToOne(() => ProductCollection)
    @JoinColumn({ name: "collection_id" })
    collection: ProductCollection

    @OneToMany(() => Product, (product) => product.set)
    products: Product[]

    @DbAwareColumn({ type: "jsonb", nullable: true })
    metadata: Record<string, unknown>

    @BeforeInsert()
    private createHandleIfNotProvided(): void {
        if (this.id) return
        this.id = generateEntityId(this.id, "pcol")
        if (!this.handle) {
            this.handle = _.kebabCase(this.title)
        }
    }
}