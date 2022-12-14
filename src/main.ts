import express = require('express');
const config = require('../medusa-config');
import { Medusa } from 'medusa-extender';
import { resolve } from 'path';
import { ExampleModule } from './modules/example/example.module';
import { 
    ProductModule, 
    UserModule, 
    StoreModule, 
    OrderModule, 
    InviteModule, 
    RoleModule, 
    PermissionModule, 
} from 'medusa-marketplace';

async function bootstrap() {
    const expressInstance = express();
    
    // await new Medusa(resolve(__dirname, '..'), expressInstance).load([ExampleModule]);
    
    await new Medusa(resolve(__dirname, '..'), expressInstance).load([
        UserModule,
        ProductModule,
        StoreModule,
        OrderModule,
        InviteModule,
        RoleModule,
        PermissionModule
    ]);

    const port = config?.serverConfig?.port ?? 9000;
    expressInstance.listen(port, () => {
        console.info('Server successfully started on port ' + port);
    });
}



bootstrap();