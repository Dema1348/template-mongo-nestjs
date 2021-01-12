import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Item } from '../../items/items.model';

export class CreateOrderDto {
  @ApiProperty({
    example: '123456789',
    minLength: 6,
    maxLength: 255,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  code: string;

  @ApiProperty({
    isArray: true,
    type: [String],
  })
  @IsOptional()
  items?: Item[];
}
