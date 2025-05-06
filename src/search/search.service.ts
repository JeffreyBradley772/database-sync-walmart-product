import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, map } from 'rxjs';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { WalmartApiResponse, WalmartProduct, WalmartSearchOptions, parseWalmartProducts } from './types/walmart-api.types';

// Interface for the signature response
export interface SignatureResponse {
  signature: string;
  timestamp: number;
}

@Injectable()
export class SearchService {
    /**
     * https://developer.api.walmart.com/api-proxy/service/affil/product/v2/search?publisherId={Your
Impact Radius Publisher Id}&query=tv&categoryId=3944&sort=price&order=ascending
     */
    private readonly walmartApiUrl = 'https://developer.api.walmart.com/api-proxy/service/affil/product/v2/search';
    


    private readonly consumerId: string;
    
    constructor(
        private readonly http: HttpService,
        private readonly configService: ConfigService
    ) {
        const consumerId = this.configService.get<string>('WALMART_CONSUMER_ID');
        
        if (!consumerId) {
            throw new Error('WALMART_CONSUMER_ID environment variable is not set');
        }
        
        this.consumerId = consumerId;
        console.log('Consumer ID set to:', this.consumerId);
    }

    private generateSignature(): SignatureResponse {
        try {
            const timestamp = new Date().getTime();
            const keyVersion = "1";
            const message = `${this.consumerId}\n${timestamp}\n${keyVersion}\n`;
            const rsaSigner = crypto.createSign('RSA-SHA256');
            rsaSigner.update(message);
            
            // Read the private key path from environment variables
            const privateKeyPath = this.configService.get<string>('PRIVATE_KEY_PATH');
            
            // Check if the path exists
            if (!privateKeyPath) {
                throw new Error('PRIVATE_KEY_PATH environment variable is not set');
            }
            
            // Resolve the path (handles relative paths)
            const resolvedPath = path.resolve(privateKeyPath);
            const privateKey = fs.readFileSync(resolvedPath, 'utf8');
            
            const signature = rsaSigner.sign(privateKey, 'base64');
            return { signature, timestamp };
        } catch (error) {
            console.error('Error generating signature:', error);
            throw new Error(`Failed to generate signature: ${error.message}`);
        }
    }

    async searchProduct(product: string): Promise<WalmartApiResponse> {

        if (!product) {
            throw new Error('Product query parameter is required');
        }
        
        const { signature, timestamp }: SignatureResponse = this.generateSignature();
        
        const walmart_headers = {
            "WM_CONSUMER.ID": this.configService.get<string>('WALMART_CONSUMER_ID'),
            "WM_CONSUMER.INTIMESTAMP": timestamp,
            "WM_SEC.KEY_VERSION": "1",
            "WM_SEC.AUTH_SIGNATURE": signature
        };

        const params: WalmartSearchOptions = {
            query: product,
            numItems: 25,
        };

        const observable = this.http.get<WalmartApiResponse>(this.walmartApiUrl, {
            headers: walmart_headers,
            params: params
        }).pipe(
            map((response) => response.data),
            catchError((error) => {
                console.error('Error in searchProduct request:', error.response?.data || error.message);
                console.error('Error status:', error.response?.status);
                console.error('Error headers:', error.response?.headers);
                console.error('Error config:', error.response?.config);
                throw new Error(error);
            })
        );

        return firstValueFrom(observable);
    }
    
    /**
     * Get just the products array from the Walmart API response
     */
    async getProducts(product: string): Promise<string[]> {
        const response = await this.searchProduct(product);
        console.log("Total results: " + response.totalResults);
        const names: string[] = [];
        for (const product of response.items) {
            names.push(`${product.brandName} - ${product.salePrice}`);
        }
        return names;
    }

}
