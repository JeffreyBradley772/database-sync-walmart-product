# Walmart API Integration Service

## Overview

This project is a NestJS-based service that integrates with the Walmart Affiliate API to search for products and store the results in a database. It was inspired by my desire to develop reusable data source of specific products to avoid rate limits on Walmart's API. Ideally this is a background service that keeps that database up to date. with the latest products within a search criteria. 

## Features

- **Walmart API Integration**: Search for products using the Walmart Affiliate API
- **Type Safety**: Comprehensive TypeScript interfaces for all API requests and responses
- **Authentication**: Secure signature-based authentication with the Walmart API
- **Error Handling**: Proper HTTP status codes and error responses
- **Database Integration**: Store search results using Prisma ORM
- **Modular Architecture**: Separation of concerns with dedicated modules for search and product management
- **Sync Module**: Simplifies syncing of products from Walmart API to the database

## Setup and Configuration

### Prerequisites

- NestJS Setup
- npm or pnpm
- A Walmart Developer account

### Walmart API Setup

1. **Register for a Walmart Developer Account**:
   - Visit [Walmart Developer Portal](https://walmart.io/)
   - Create an account and apply for API access

2. **Generate API Keys**:
   - Generate a public/private key pair using OpenSSL:
     ```bash
     openssl genrsa -out walmart_private_key.pem 2048
     openssl rsa -in walmart_private_key.pem -pubout > walmart_public_key.pem
     ```
   - Upload the public key to the Walmart Developer Portal
   - Store the private key securely in your project
   - Wait for approval, mine took a day.

3. **Obtain Consumer ID**:
   - After approval, Walmart will provide a Consumer ID
   - This ID is used along with your private key for API authentication

### Environment Configuration

Create a `.env` file with the following variables:

```
WALMART_CONSUMER_ID=your_consumer_id_here
PRIVATE_KEY_PATH=path/to/your/private_key.pem
```

## Project Structure

- **SearchModule**: Handles communication with the Walmart API
- **ProductModule**: Manages database operations and product data, via prisma/supabase connection
- **PrismaModule**: Provides database access through Prisma ORM
- **SyncModule**: Simplifies syncing of products from Walmart API to the database

## Authentication Implementation

The service uses signature-based authentication as required by the Walmart API:

1. Generate a timestamp
2. Create a message string with Consumer ID, timestamp, and key version
3. Sign the message using RSA-SHA256 with the private key
4. Include the signature and other required headers in API requests

## Current Status

The application currently supports:

- Searching for products via the Walmart API
- Parsing and typing the API responses
- Proper error handling with appropriate HTTP status codes
- Configuration via environment variables
- Syncing products from Walmart API to the database
- Saving products to database on successful search

## Next Steps

- Implement caching for API responses
- Add better pagination support
- Enhance error monitoring
- Implement rate limiting
- Add comprehensive testing

## Installation

```bash
$ npm install
```

## License

This project is MIT licensed.
