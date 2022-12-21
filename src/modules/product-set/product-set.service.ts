import { Brackets, EntityManager, ILike } from "typeorm"
import { TransactionBaseService } from "@medusajs/medusa"
import { buildQuery, isString, setMetadata } from "@medusajs/medusa/dist/utils"
import { Service } from 'medusa-extender';
import EventBusService from '@medusajs/medusa/dist/services/event-bus';
import { FindConfig, Selector } from '@medusajs/medusa/dist/types/common';
import { ProductRepository } from "@medusajs/medusa/dist/repositories/product"

import { ProductSet } from './product-set.entity';
import { ProductSetRepository } from './product-set.repository';
import { MedusaError } from 'medusa-core-utils';

import {
  CreateProductSet,
  UpdateProductSet,
} from './product-set.types'

type InjectedDependencies = {
  manager: EntityManager
  eventBusService: EventBusService
  productRepository: typeof ProductRepository
  productSetRepository: typeof ProductSetRepository
}

/**
 * Provides layer to manipulate product sets.
 */
class ProductSetService extends TransactionBaseService {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly eventBus_: EventBusService
  // eslint-disable-next-line max-len
  protected readonly productSetRepository_: typeof ProductSetRepository
  protected readonly productRepository_: typeof ProductRepository

  constructor({
    manager,
    productSetRepository,
    productRepository,
    eventBusService,
  }: InjectedDependencies) {
    super(arguments[0])
    this.manager_ = manager

    this.productSetRepository_ = productSetRepository
    this.productRepository_ = productRepository
    this.eventBus_ = eventBusService
  }

  /**
   * Retrieves a product Set by id.
   * @param setId - the id of the Set to retrieve.
   * @param config - the config of the Set to retrieve.
   * @return the Set.
   */
  async retrieve(
    setId: string,
    config: FindConfig<ProductSet> = {}
  ): Promise<ProductSet> {
    const setRepo = this.manager_.getCustomRepository(
      this.productSetRepository_
    )

    const query = buildQuery({ id: setId }, config)
    const Set = await setRepo.findOne(query)

    if (!Set) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Product Set with id: ${setId} was not found`
      )
    }

    return Set
  }

  /**
   * Retrieves a product Set by id.
   * @param setHandle - the handle of the Set to retrieve.
   * @param config - query config for request
   * @return the Set.
   */
  async retrieveByHandle(
    setHandle: string,
    config: FindConfig<ProductSet> = {}
  ): Promise<ProductSet> {
    const setRepo = this.manager_.getCustomRepository(
      this.productSetRepository_
    )

    const query = buildQuery({ handle: setHandle }, config)
    const Set = await setRepo.findOne(query)

    if (!Set) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Product Set with handle: ${setHandle} was not found`
      )
    }

    return Set
  }

  /**
   * Creates a product Set
   * @param Set - the Set to create
   * @return created Set
   */
  async create(
    Set: CreateProductSet
  ): Promise<ProductSet> {
    return await this.atomicPhase_(async (manager) => {
      const setRepo = manager.getCustomRepository(
        this.productSetRepository_
      )

      const productSet = setRepo.create(Set)
      return await setRepo.save(productSet)
    })
  }

  /**
   * Updates a product Set
   * @param setId - id of Set to update
   * @param update - update object
   * @return update Set
   */
  async update(
    setId: string,
    update: UpdateProductSet
  ): Promise<ProductSet> {
    return await this.atomicPhase_(async (manager) => {
      const setRepo = manager.getCustomRepository(
        this.productSetRepository_
      )

      const Set = await this.retrieve(setId)

      const { metadata, ...rest } = update

      if (metadata) {
        Set.metadata = setMetadata(Set, metadata)
      }

      for (const [key, value] of Object.entries(rest)) {
        Set[key] = value
      }

      return setRepo.save(Set)
    })
  }

  /**
   * Deletes a product Set idempotently
   * @param setId - id of Set to delete
   * @return empty promise
   */
  async delete(setId: string): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const productSetRepo = manager.getCustomRepository(
        this.productSetRepository_
      )

      const Set = await this.retrieve(setId)

      if (!Set) {
        return Promise.resolve()
      }

      await productSetRepo.softRemove(Set)

      return Promise.resolve()
    })
  }

  async addProducts(
    setId: string,
    productIds: string[]
  ): Promise<ProductSet> {
    return await this.atomicPhase_(async (manager) => {
      const productRepo = manager.getCustomRepository(this.productRepository_)

      const { id } = await this.retrieve(setId, { select: ["id"] })

      await productRepo.bulkAddToSet(productIds, id)

      return await this.retrieve(id, {
        relations: ["products"],
      })
    })
  }

  async removeProducts(
    setId: string,
    productIds: string[]
  ): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const productRepo = manager.getCustomRepository(this.productRepository_)

      const { id } = await this.retrieve(setId, { select: ["id"] })

      await productRepo.bulkRemoveFromSet(productIds, id)

      return Promise.resolve()
    })
  }

  /**
   * Lists product sets
   * @param selector - the query object for find
   * @param config - the config to be used for find
   * @return the result of the find operation
   */
  async list(
    selector: Selector<ProductSet> & {
      q?: string
      discount_condition_id?: string
    } = {},
    config = { skip: 0, take: 20 }
  ): Promise<ProductSet[]> {
    const [sets] = await this.listAndCount(selector, config)
    return sets
  }

  /**
   * Lists product sets and add count.
   * @param selector - the query object for find
   * @param config - the config to be used for find
   * @return the result of the find operation
   */
  async listAndCount(
    selector: Selector<ProductSet> & {
      q?: string
      discount_condition_id?: string
    } = {},
    config: FindConfig<ProductSet> = { skip: 0, take: 20 }
  ): Promise<[ProductSet[], number]> {
    const productSetRepo = this.manager_.getCustomRepository(
      this.productSetRepository_
    )

    let q
    if (isString(selector.q)) {
      q = selector.q
      delete selector.q
    }

    const query = buildQuery(selector, config)

    if (q) {
      const where = query.where

      delete where.title
      delete where.handle
      delete where.created_at
      delete where.updated_at

      query.where = (qb): void => {
        qb.where(where)

        qb.andWhere(
          new Brackets((qb) => {
            qb.where({ title: ILike(`%${q}%`) }).orWhere({
              handle: ILike(`%${q}%`),
            })
          })
        )
      }
    }

    if (query.where.discount_condition_id) {
      const discountConditionId = query.where.discount_condition_id as string
      delete query.where.discount_condition_id
      return await productSetRepo.findAndCountByDiscountConditionId(
        discountConditionId,
        query
      )
    }

    return await productSetRepo.findAndCount(query)
  }
}

export default ProductSetService