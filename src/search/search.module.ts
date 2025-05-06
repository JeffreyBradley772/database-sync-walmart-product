import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService] // Export SearchService so it can be used in other modules
})
export class SearchModule {}
