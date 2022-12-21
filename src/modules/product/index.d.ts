import { ProductSet } from '../product-set/product-set.entity';
import { default as ExtendedProductRepository } from './product.repository';

declare module '@medusajs/medusa/dist/models/product' {
    declare interface Product {
        set_id: string;
        set: ProductSet;
    }
}

declare module "@medusajs/medusa/dist/repositories/product" {
    declare class ProductRepository extends ExtendedProductRepository { }
}