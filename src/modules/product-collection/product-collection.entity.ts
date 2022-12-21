import { Column, Entity } from "typeorm"; 
import { Entity as MedusaEntity, Utils } from "medusa-extender";
import { ProductCollection as MedusaProductCollection } from '@medusajs/medusa/dist';
import { ProductSet } from '../product-set/product-set.entity';


@MedusaEntity({ override: MedusaProductCollection })
@Entity()
export class ProductCollection extends Utils.Omit(
    MedusaProductCollection, 
    ['products']
) {
    @Column()
    sets: ProductSet[];
}