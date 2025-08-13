# Walmart Product Catalog Service

## Overview

This project is a NestJS-based service that manages a personal database of Walmart products and syncs data from the Walmart API to avoid rate limiting. It serves as a background service that keeps the product database up-to-date with the latest products within specific search criteria. This example supports my silly side project, flossreviews.com.

## Features

- **Product Database Management**: Store and manage Walmart product data using Prisma ORM
- **Sync Service**: Automated syncing of products from the external Search API to the database to avoid rate limits
- **Type Safety**: Comprehensive TypeScript interfaces for all database operations
- **Error Handling**: Proper HTTP status codes and error responses
- **Modular Architecture**: Separation of concerns with dedicated modules for product management and sync operations
- **Rate Limit Avoidance**: Maintains personal product database to reduce API calls

## Setup and Configuration

### Prerequisites

- NestJS Setup
- npm or pnpm
- A Walmart Developer account

### Search API Service Setup

This service depends on the separate [walmart-api-service](https://github.com/JeffreyBradley772/walmart-api-service) for Walmart API integration. The search service handles:

- Walmart API authentication and signature generation
- Product search and taxonomy endpoints
- Rate limiting and caching to protect against API limits

To use this catalog service, you'll need the search service running and accessible.

### Environment Configuration

Create a `.env` file with the following variables:

```
# Database connection
DATABASE_URL=your_postgresql_connection_string
DIRECT_URL=your_postgresql_connection_string
```

## Project Structure

- **ProductModule**: Manages database operations and product data via Prisma/Supabase connection
- **SyncModule**: Handles syncing of products from the external Search API to the database
- **PrismaModule**: Provides database access through Prisma ORM

## API Endpoints

### Product Management
- `GET /product` - Retrieve all products from local database
- `GET /product/search?query=<term>` - Search for products in the database by query
- `GET /product/:id` - Get a specific product by ID
- `POST /product/save` - Save a single product to the database
- `POST /product/save-many` - Save multiple products to the database (Needs updated to batch insert)
- `DELETE /product/:id` - Remove product from database

### Sync Operations
- `POST /sync` - Manually trigger product sync from Search API
- `POST /sync/paginated?pages=<number>` - Sync multiple pages of products (default: 200 pages)

## Next Steps

- Implement scheduled background sync jobs
- Enhance error monitoring and alerting
- Implement data validation and cleanup routines

## License

This project is MIT licensed.
