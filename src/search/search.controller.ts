import { Controller, Get, Query, HttpException, HttpStatus, HttpCode, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiExtraModels } from '@nestjs/swagger';
import { SearchResponseDto } from './dto/search-response.dto';
import { SearchQueryDto } from './dto/search-query.dto';
import { SearchService } from './search.service';

@ApiTags('search')
@ApiExtraModels(SearchResponseDto, SearchQueryDto)
@Controller('search')
export class SearchController {

    constructor(private readonly searchService: SearchService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Search for products on Walmart', description: 'Searches the Walmart API for products matching the query string' })
    @ApiResponse({ status: 200, description: 'Products successfully retrieved. Returns list of product name and price base don relevance to query.'})
    @ApiResponse({ status: 400, description: 'Bad request - Missing or invalid parameters' })
    @ApiResponse({ status: 500, description: 'Internal server error - Failed to fetch products' })
    async searchProduct(@Query(ValidationPipe) query: SearchQueryDto): Promise<{success: boolean, count: number, products: string[]}> {
        console.log(`Query from product controller ${query.start}`)
        try {
            const products = await this.searchService.getProductsNameAndPrice({
                query: query.product,
                numItems: query.numItems,
                start: query.start
            });
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

    @Get('full')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get full product results on Walmart', description: 'Searches the Walmart API for products matching the query string' })
    @ApiResponse({ status: 200, description: 'Products successfully retrieved. Returns list of product name and price base don relevance to query.'})
    @ApiResponse({ status: 400, description: 'Bad request - Missing or invalid parameters' })
    @ApiResponse({ status: 500, description: 'Internal server error - Failed to fetch products' })
    async searchProductFull(@Query(ValidationPipe) query: SearchQueryDto): Promise<SearchResponseDto> {
        console.log(`Query from product controller ${query.start}`)
        try {
            const products = await this.searchService.getWalmartProducts({
                query: query.product,
                numItems: query.numItems,
                start: query.start
            });
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
