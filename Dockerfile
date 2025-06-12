# Stage 1: Build the application
FROM node:20-slim AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install all dependencies (including devDependencies for build and prisma generate)
RUN npm install

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy the rest of the application source code
COPY . .

# Build the application
RUN npm run build
# This will create the 'dist' folder

# Stage 2: Production image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy built application from builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Copy Prisma client generated in builder stage
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Copy the private key directory
COPY keys ./keys

# Expose the port the app runs on (default 8001 from src/main.ts)
EXPOSE 8001

# Command to run the application
# Corresponds to "start:prod": "node dist/main" in package.json
CMD ["node", "dist/main.js"]
