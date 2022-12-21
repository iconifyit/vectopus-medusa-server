import { 
    Column, 
    Entity, 
    ManyToOne, 
    JoinColumn, 
} from "typeorm"; 
import { Entity as MedusaEntity, Utils } from "medusa-extender";
import { Product as MedusaProduct } from '@medusajs/medusa/dist';
import { ProductSet } from '../product-set/product-set.entity';


@MedusaEntity({ override: MedusaProduct })
@Entity()
export class Product extends Utils.Omit(
    MedusaProduct, 
    ['collection_id', 'collection']
) {
    @Column()
    set_id: string | null;

    @ManyToOne(() => ProductSet)
    @JoinColumn({ name: "set_id", referencedColumnName: "id" })
    set: ProductSet
}