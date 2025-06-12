import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  // Set up Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Walmart API Integration')
    .setDescription('API for searching Walmart products and storing results')
    .setVersion('1.0')
    .addTag('search', 'WalmartProduct search operations to walmart.io API')
    .addTag('products', 'Product database operations')
    .addTag('sync', 'Sync operations for automatic syncing of supabase database products table')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(process.env.PORT ?? 8001);
}
bootstrap();
