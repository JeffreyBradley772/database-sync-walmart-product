import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SyncService } from '@/sync/sync.service';
import { ProductModule } from '@/product/product.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SyncController } from '@/sync/sync.controller';
import { ProductService } from '@/product/product.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [SyncService, ProductService],
  imports: [
    HttpModule,
    ProductModule,
    ConfigModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [SyncController],
})
export class SyncModule {}
