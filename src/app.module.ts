import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppImports } from './app.imports';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { ItemsModule } from './items/items.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [...AppImports, ItemsModule, OrdersModule, HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
