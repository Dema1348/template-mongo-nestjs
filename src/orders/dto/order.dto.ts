import { ApiProperty } from '@nestjs/swagger';
import { Item } from 'src/items/items.model';

export class OrderDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty({
    isArray: true,
    type: [String],
  })
  items?: Item[];
}
