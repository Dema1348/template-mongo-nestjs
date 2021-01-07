import { forwardRef, Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ItemsModule } from 'src/items/items.module';
import { OrdersController } from './orders.controller';

import { Order } from './orders.model';
import { OrdersService } from './orders.service';

@Module({
  imports: [TypegooseModule.forFeature([Order]), forwardRef(() => ItemsModule)],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
