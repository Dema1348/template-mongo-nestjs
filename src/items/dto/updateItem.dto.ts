import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateItemDto {
  @ApiProperty({
    example: 'example',
    minLength: 6,
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  stock: number;

  @ApiProperty({
    isArray: true,
    type: [String],
  })
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];
}
