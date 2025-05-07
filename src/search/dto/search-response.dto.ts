import { ApiProperty } from '@nestjs/swagger';
import { WalmartProduct } from '../types/walmart-api.types';

export class SearchResponseDto {
  @ApiProperty({
    description: 'Indicates if the operation was successful',
    example: true
  })
  success: boolean;

  @ApiProperty({
    description: 'Number of products returned',
    example: 10
  })
  count: number;

  @ApiProperty({
    description: 'List of products matching the search query',
    type: 'array',
    isArray: true
  })
  products: WalmartProduct[];
}
