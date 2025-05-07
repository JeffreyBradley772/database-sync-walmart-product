import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { ProductModule } from '../product/product.module';
import { SearchModule } from '../search/search.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SyncController } from './sync.controller';
import { ProductService } from 'src/product/product.service';

@Module({
  providers: [SyncService, ProductService],
  imports: [ProductModule, 
    SearchModule,
    ScheduleModule.forRoot()
  ],
  controllers: [SyncController]
})
export class SyncModule {}
