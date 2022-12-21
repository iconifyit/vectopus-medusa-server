import { Repository as MedusaRepository } from "medusa-extender";
import { EntityRepository, Repository } from "typeorm";
import { ExtendedFindConfig, Selector } from "@medusajs/medusa/dist/types/common"
import { ProductSet } from './product-set.entity.js';

// @MedusaRepository()
// @EntityRepository(ProductSet)
// export class ProductSetRepository extends Repository<ProductSet>{}

@MedusaRepository()
@EntityRepository(ProductSet)
// eslint-disable-next-line max-len
export class ProductSetRepository extends Repository<ProductSet> {
    async findAndCountByDiscountConditionId(
        conditionId: string,
        query: ExtendedFindConfig<ProductSet, Selector<ProductSet>>
    ): Promise<[ProductSet[], number]> {
        const qb = this.createQueryBuilder("ps")

        if (query?.select) {
            qb.select(query.select.map((select) => `ps.${select}`))
        }

        if (query.skip) {
            qb.skip(query.skip)
        }

        if (query.take) {
            qb.take(query.take)
        }

        return await qb
            .where(query.where)
            .innerJoin(
                "discount_condition_product_set",
                "dc_ps",
                `dc_ps.product_set_id = pc.id AND dc_pc.condition_id = :dcId`,
                { dcId: conditionId }
            )
            .getManyAndCount()
    }
}