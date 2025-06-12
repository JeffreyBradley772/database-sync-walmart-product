import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class SearchQueryDto {
  @ApiProperty({
    description: 'The product name or keyword to search for',
    example: 'laptop',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  product: string;

  @ApiProperty({
    description: 'Maximum number of results to return',
    example: 10,
    required: false,
    default: 25
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(25)
  @Type(() => Number)
  @Transform(({ value }) => value !== undefined ? value : 25)
  numItems?: number;

  @ApiProperty({
    description: 'Item to start at',
    example: 1,
    required: false,
    default: 1
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(999)
  @Type(() => Number)
  @Transform(({ value }) => value !== undefined ? value : 1)
  start?: number;
}
