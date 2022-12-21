import { MedusaAuthenticatedRequest, Router } from 'medusa-extender';
import ProductSetService from './product-set.service';
import { Response, NextFunction } from "express";
import { ProductSet } from './product-set.entity';


@Router({
    routes: [{
        requiredAuth: true,
        path: '/admin/product-sets',
        method: 'get',
        handlers: [
            async (
                req: MedusaAuthenticatedRequest, 
                res: Response, 
                next: NextFunction
            ): Promise<Response<ProductSet[]>> => {

                const productSetService = req.scope.resolve('productSetService') as ProductSetService;
                const sets = await productSetService.list()
                return res.send(sets);
            }
        ]
    }] 
})
export class ProductSetRouter {}