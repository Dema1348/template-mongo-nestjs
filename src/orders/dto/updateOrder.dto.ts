import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Item } from 'src/items/items.model';

export class UpdateOrderDto {
  @ApiProperty({
    example: '12345678',
    minLength: 6,
    maxLength: 255,
    required: false,
  })
  @IsOptional()
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
