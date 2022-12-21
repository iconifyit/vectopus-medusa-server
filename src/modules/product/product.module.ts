import { Module } from 'medusa-extender';
import { default as ExtendedProductRepository } from './product.repository';
import { Product } from './product.entity';

@Module({
    imports: [Product, ExtendedProductRepository]
})
export class ProductModule {}