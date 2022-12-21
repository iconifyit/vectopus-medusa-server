import { ProductRepository as MedusaProductRepository } from "@medusajs/medusa/dist/repositories/product";
import { Repository as MedusaRepository, Utils } from "medusa-extender";
import { EntityRepository, In } from "typeorm";
import { Product } from "./product.entity";

@MedusaRepository({ override: MedusaProductRepository })
@EntityRepository(Product)
export default class ProductRepository extends Utils.repositoryMixin<Product, MedusaProductRepository>(MedusaProductRepository) {
    public async bulkAddToSet(
        productIds: string[],
        setId: string
    ): Promise<Product[]> {
        await this.createQueryBuilder()
            .update(Product)
            .set({ set_id: setId })
            .where({ id: In(productIds) })
            .execute()
        return this.findByIds(productIds)
    }

    public async bulkRemoveFromSet(
        productIds: string[],
        setId: string
    ): Promise<Product[]> {
        await this.createQueryBuilder()
            .update(Product)
            .set({ set_id: null })
            .where({ id: In(productIds), set_id: setId })
            .execute()

        return this.findByIds(productIds)
    }
}

