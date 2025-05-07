import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';

export class FlossProductDto {
  @ApiProperty({
    description: 'Product ID',
    example: '12345'
  })
  id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Wireless Bluetooth Headphones'
  })
  name: string;

  @ApiProperty({
    description: 'Brand name',
    example: 'Sony'
  })
  brand: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Noise cancelling wireless headphones with 30-hour battery life',
    required: false
  })
  description?: string;

  @ApiProperty({
    description: 'Product type',
    example: 'walmart'
  })
  type: string;

  @ApiProperty({
    description: 'Product price',
    example: 149.99,
    required: false
  })
  price?: Decimal;

  @ApiProperty({
    description: 'Product image URL',
    example: 'https://example.com/image.jpg',
    required: false
  })
  imageUrl?: string;

  @ApiProperty({
    description: 'Creation date',
    type: Date
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    type: Date
  })
  updatedAt: Date;
}
