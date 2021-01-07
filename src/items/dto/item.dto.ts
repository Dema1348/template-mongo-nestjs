import { ApiProperty } from '@nestjs/swagger';

export class ItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  stock: number;

  @ApiProperty({
    isArray: true,
    type: [String],
  })
  tags: string[];
}
