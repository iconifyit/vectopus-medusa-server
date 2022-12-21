import { Module } from 'medusa-extender';
import { ProductSetMigration1671602170463 } from './1671602170463-product-set.migration';
import { ProductSetMigration1671336242763 } from './1671336242763-product-set.migration';
import { alterProductAddSetId1671309768368 } from './1671309768368-product-set.migration';
import { ProductSetRepository } from './product-set.repository';
import { ProductSet } from './product-set.entity';
import ProductSetService from './product-set.service';
import { ProductSetRouter } from './product-set.router';

@Module({
    imports: [
        ProductSetRouter, 
        ProductSetService, 
        ProductSet, 
        ProductSetRepository,
        alterProductAddSetId1671309768368,
        ProductSetMigration1671336242763,
        ProductSetMigration1671602170463
    ],
})
export class ProductSetModule {}