import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpErrorResponseDto } from '../utils/errors/http.dto';
import { CreateItemDto } from './dto/createItem.dto';
import { ItemDto } from './dto/item.dto';
import { UpdateItemDto } from './dto/updateItem.dto';
import { Item } from './items.model';
import { ItemsService } from './items.service';

@ApiTags('Items')
@Controller('items')
export class ItemsController {
  constructor(private itemsService: ItemsService) {}

  @ApiOperation({
    summary: 'Create items',
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: ItemDto })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: HttpErrorResponseDto,
    description: 'Internal server error',
  })
  @Post()
  async create(@Body() item: CreateItemDto): Promise<Item> {
    return this.itemsService.create(item);
  }

  @ApiOperation({
    summary: 'Get all items',
  })
  @ApiResponse({ status: HttpStatus.OK, type: [ItemDto] })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: HttpErrorResponseDto,
    description: 'Internal server error',
  })
  @ApiQuery({ name: 'stock', required: false })
  @ApiQuery({ name: 'tags', required: false, type: [String] })
  @ApiQuery({ name: 'name', required: false })
  @Get()
  async getItems(
    @Query('stock') stock: number,
    @Query('tags') tags: string,
    @Query('name') name: string,
  ): Promise<Item[]> {
    return this.itemsService.findAll(stock, tags, name);
  }

  @ApiOperation({
    summary: 'Count items',
  })
  @ApiResponse({ status: HttpStatus.OK, type: Number })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: HttpErrorResponseDto,
    description: 'Internal server error',
  })
  @Get('count')
  async count(): Promise<number> {
    return this.itemsService.count();
  }

  @ApiOperation({
    summary: 'Find one item',
  })
  @ApiResponse({ status: HttpStatus.OK, type: ItemDto })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: HttpErrorResponseDto,
    description: 'Not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: HttpErrorResponseDto,
    description: 'Internal server error',
  })
  @ApiParam({ name: 'id', description: 'id of item' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Item> {
    return this.itemsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Delete one item',
  })
  @ApiResponse({ status: HttpStatus.OK, type: ItemDto })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: HttpErrorResponseDto,
    description: 'Internal server error',
  })
  @ApiParam({ name: 'id', description: 'id of item' })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Item> {
    return this.itemsService.delete(id);
  }

  @ApiOperation({
    summary: 'Update one item',
  })
  @ApiResponse({ status: HttpStatus.OK, type: ItemDto })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: HttpErrorResponseDto,
    description: 'Internal server error',
  })
  @ApiParam({ name: 'id', description: 'id of item' })
  @Patch(':id')
  async patch(
    @Param('id') id: string,
    @Body() item: UpdateItemDto,
  ): Promise<Item> {
    return this.itemsService.update(id, item);
  }
}
