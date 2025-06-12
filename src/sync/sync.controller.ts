import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { SyncService } from './sync.service';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('sync')
@Controller('sync')
export class SyncController {
    constructor(private readonly syncService: SyncService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Sync products from Walmart', description: 'Syncs products from Walmart API to the database' })
    @ApiResponse({ status: 200, description: 'Products successfully synced' })
    @ApiResponse({ status: 500, description: 'Internal server error - Failed to sync products' })
    async syncProducts(): Promise<{success: boolean, message: string}> {
        await this.syncService.syncProducts();
        return { success: true, message: 'Products sync initiated' };
    }
    
    @Get('paginated')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Sync multiple pages of products', 
        description: 'Fetches and syncs multiple pages of products from Walmart API to the database' 
    })
    @ApiQuery({ name: 'pages', required: false, type: Number, description: 'Number of pages to fetch (default: 200)' })
    @ApiResponse({ status: 200, description: 'Products successfully synced' })
    @ApiResponse({ status: 500, description: 'Internal server error - Failed to sync products' })
    async syncPaginatedProducts(@Query('pages') pages?: number): Promise<{success: boolean, totalPages: number, totalProducts: number, message: string}> {
        return await this.syncService.syncWithPagination(pages ? Number(pages) : undefined);
    }
}
