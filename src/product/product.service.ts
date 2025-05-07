import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FlossProduct, Prisma } from '@prisma/client';
import { WalmartProduct } from 'src/search/types/walmart-api.types';

@Injectable()
export class ProductService {
    constructor(private readonly prisma: PrismaService) {}

    async saveProduct(product: WalmartProduct): Promise<FlossProduct> {

        const productId = product.itemId.toString();

        const createData: Prisma.FlossProductCreateInput = {
            id: productId,
            name: product.name,
            brand: product.brandName || 'Unknown',
            description: product.shortDescription,
            type: 'walmart',
            price: product.salePrice ? new Prisma.Decimal(product.salePrice) : null,
            imageUrl: product.thumbnailImage,
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        const updateData: Prisma.FlossProductUpdateInput = {
            name: product.name,
            brand: product.brandName || 'Unknown',
            description: product.shortDescription,
            type: 'walmart',
            price: product.salePrice ? new Prisma.Decimal(product.salePrice) : null,
            imageUrl: product.thumbnailImage,
            updatedAt: new Date(),
        }

        return this.prisma.flossProduct.upsert({
            where: { id: productId },
            update: updateData,
            create: createData,
        });
    }

    /**
     * Save multiple Walmart products to the database
     */
    async saveProducts(products: WalmartProduct[]): Promise<FlossProduct[]> {
        const savedProducts: FlossProduct[] = [];
        for (const product of products) {
            const saved = await this.saveProduct(product);
            savedProducts.push(saved);
        }
        return savedProducts;
    }

    /**
     * Get all products from the database
     */
    async getAllProducts(): Promise<FlossProduct[]> {
        const products = await this.prisma.flossProduct.findMany();
        return products;
    }

    /**
     * Search for products in the database
     */
    async searchDatabase(query: string): Promise<FlossProduct[]> {
        const products = await this.prisma.flossProduct.findMany({
            where: {
                   OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { brand: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } }
                ]
            }
        });

        // Sort the results to prioritize brand matches
        return products.sort((a, b) => {
            // Check if brand contains the query (case insensitive)
            const aBrandMatch = a.brand?.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
            const bBrandMatch = b.brand?.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
            
            // If one has a brand match and the other doesn't, prioritize the brand match
            if (aBrandMatch !== bBrandMatch) {
                return bBrandMatch - aBrandMatch; // Higher score first
            }
            
            // If both have the same brand match status, check name match
            const aNameMatch = a.name?.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
            const bNameMatch = b.name?.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
            
            if (aNameMatch !== bNameMatch) {
                return bNameMatch - aNameMatch;
            }
            
            // If all else is equal, sort alphabetically by brand
            return (a.brand || '').localeCompare(b.brand || '');
        });
    }

    /**
     * Get a product by ID
     */
    async getProductById(id: string): Promise<FlossProduct> {
        const product = await this.prisma.flossProduct.findUnique({ where: { id } });
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }

    /**
     * Delete a product by ID
     */
    async deleteProduct(id: string): Promise<FlossProduct> {
        const product = await this.prisma.flossProduct.findUnique({ where: { id } });
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return this.prisma.flossProduct.delete({ where: { id } });
    }
}