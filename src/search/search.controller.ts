import { Controller, Get, Query, HttpException, HttpStatus, HttpCode } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {

    constructor(private readonly searchService: SearchService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async searchProduct(@Query('product') product: string) {
        if (!product) {
            throw new HttpException('Product query parameter is required', HttpStatus.BAD_REQUEST);
        }
        
        try {
            const products = await this.searchService.getProducts(product);
            return {
                success: true,
                count: products.length,
                products
            };
        } catch (error) {
            throw new HttpException(
                `Failed to fetch products: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
