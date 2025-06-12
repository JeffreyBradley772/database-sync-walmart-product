import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { ProductService } from 'src/product/product.service';
import { SearchService } from 'src/search/search.service';
import { WalmartProduct } from 'src/search/types/walmart-api.types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SyncService {
    private myProduct: string;

    constructor(
        private readonly productService: ProductService,
        private readonly searchService: SearchService,
        private readonly configService: ConfigService
    ) {
        this.myProduct = this.configService.get<string>('SYNC_PRODUCT') ?? 'floss';
    }
    start: number = 0;

    async syncProducts() {
        // Reset start position for each sync run
        this.start = 1;
        
        // Get first batch of products
        console.log(`Running product sync at ${new Date().toISOString()}`);
        const products: WalmartProduct[] = await this.searchService.getWalmartProducts({ 
            query: this.myProduct, 
            numItems: 25,
            start: this.start
        });
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
    async syncWithPagination(maxPages: number = 200) {
        // Reset start position
        this.start = 1;
        let totalProducts = 0;
        
        // Loop through pages (maximum of 1000 items total due to API limitations)
        for (let i = 0; i < maxPages && this.start < 1000; i++) {
            console.log(`Fetching page ${i+1} starting from item ${this.start}`);
            
            try {
                const products: WalmartProduct[] = await this.searchService.getWalmartProducts({ 
                    query: this.myProduct,
                    numItems: 25, 
                    start: this.start 
                });
                
                console.log(`Found ${products.length} products on page ${i+1}`);
                
                // If no products returned, we've reached the end
                if (products.length === 0) {
                    console.log('No more products to fetch. Ending pagination.');
                    break;
                }
                
                // Save products to database
                for (const product of products) {
                    await this.productService.saveProduct(product);
                }
                
                totalProducts += products.length;
                
                // Increment start for next page
                this.start += 25;
                
                // Add a small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                console.error(`Error fetching page ${i+1}:`, error.message);
                break;
            }
        }
        
        return {
            success: true,
            totalPages: Math.ceil(this.start / 25),
            totalProducts: totalProducts,
            message: `Successfully synced ${totalProducts} products across ${Math.ceil(this.start / 25)} pages`
        };
    }
}
