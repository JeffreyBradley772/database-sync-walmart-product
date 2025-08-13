import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { WalmartProduct } from '@/search/types/search.types';
import { FlossProduct } from '@prisma/client';

@ApiTags('products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products from the database' })
  @ApiResponse({ status: 200, description: 'Returns all products' })
  async getAllProducts(): Promise<FlossProduct[]> {
    const products = await this.productService.getAllProducts();
    return products;
  }

  @Get('search')
  @ApiOperation({ summary: 'Search for products in the database' })
  @ApiQuery({ name: 'query', required: true, description: 'Search term' })
  @ApiResponse({ status: 200, description: 'Returns matching products' })
  async getProductByQuery(
    @Query('query') query: string,
  ): Promise<FlossProduct[]> {
    const products = await this.productService.searchDatabase(query);
    return products;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Returns the product' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProductById(@Param('id') id: string): Promise<FlossProduct> {
    return this.productService.getProductById(id);
  }

  @Post('save')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Save a product to the database' })
  @ApiResponse({ status: 201, description: 'Product saved successfully' })
  async saveProduct(@Body() product: WalmartProduct): Promise<FlossProduct> {
    return this.productService.saveProduct(product);
  }

  @Post('save-many')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Save multiple products to the database' })
  @ApiResponse({ status: 201, description: 'Products saved successfully' })
  async saveProducts(
    @Body() products: WalmartProduct[],
  ): Promise<FlossProduct[]> {
    return this.productService.saveProducts(products);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async deleteProduct(@Param('id') id: string): Promise<FlossProduct> {
    return this.productService.deleteProduct(id);
  }
}
