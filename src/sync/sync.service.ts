import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { ProductService } from '@/product/product.service';
import { ConfigService } from '@nestjs/config';
import { FullSearchQuery, WalmartProduct } from '@/search/types/search.types';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SyncService {
  private myProduct: string;
  private readonly myWalmartApiServiceUrl: string =
    'http://localhost:3111/search/full';

  constructor(
    private readonly productService: ProductService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.myProduct = this.configService.get<string>('SYNC_PRODUCT') ?? 'floss';
  }
  start: number = 0;

  async syncProducts() {
    // Reset start position for each sync run
    this.start = 1;

    const queryParams: FullSearchQuery = {
      query: this.myProduct,
      numItems: 25,
      start: this.start,
    };

    const productResponse = await firstValueFrom(
      this.httpService.get(this.myWalmartApiServiceUrl, {
        params: queryParams,
      }),
    );

    // Log the full response structure for debugging
    console.log(
      'API Response structure:',
      JSON.stringify(productResponse.data, null, 2),
    );

    // Verify response format
    if (!productResponse.data) {
      throw new Error('No data received from API');
    }

    if (!Array.isArray(productResponse.data)) {
      console.warn(
        'Expected items array, got:',
        typeof productResponse.data,
      );
      throw new Error('Invalid response format: items is not an array');
    }

    const products = productResponse.data;
    // Get first batch of products
    console.log(`Running product sync at ${new Date().toISOString()}`);
    console.log(`Found ${products.length} products to sync`);

    for (const product of products) {
      await this.productService.saveProduct(product);
    }
  }

  /**
   * Sync products with pagination
   * @param maxPages Maximum number of pages to fetch (default: 20, which is 500 products with 25 per page)
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async syncWithPagination(maxPages: number = 20) {
    // Reset start position
    this.start = 1;
    let totalProducts = 0;

    // Loop through pages (maximum of 1000 items total due to API limitations)
    for (let i = 0; i < maxPages && this.start < 1000; i++) {
      console.log(`Fetching page ${i + 1} starting from item ${this.start}`);

      try {
        const queryParams: FullSearchQuery = {
          query: this.myProduct,
          numItems: 25,
          start: this.start,
        };

        const productResponse = await firstValueFrom(
          this.httpService.get(this.myWalmartApiServiceUrl, {
            params: queryParams,
          }),
        );

        // Verify response format
        if (
          !productResponse.data ||
          !Array.isArray(productResponse.data)
        ) {
          console.warn('Invalid response format on page', i + 1);
          break;
        }

        const products: WalmartProduct[] = productResponse.data;

        console.log(`Found ${products.length} products on page ${i + 1}`);

        // If no products returned, we've reached the end
        if (products.length === 0) {
          console.log('No more products to fetch. Ending pagination.');
          break;
        }

        // Save products to database
        await this.productService.saveProducts(products);

        totalProducts += products.length;

        // Increment start for next page
        this.start += 25;

        // Add a small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error fetching page ${i + 1}:`, error.message);
        break;
      }
    }

    return {
      success: true,
      totalPages: Math.ceil(this.start / 25),
      totalProducts: totalProducts,
      message: `Successfully synced ${totalProducts} products across ${Math.ceil(this.start / 25)} pages`,
    };
  }
}
