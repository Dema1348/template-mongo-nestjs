import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateItemDto {
  @ApiProperty({
    example: 'example',
    minLength: 6,
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
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
