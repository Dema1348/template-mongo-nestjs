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
import { CreateOrderDto } from './dto/createOrder.dto';
import { OrderDto } from './dto/order.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';
import { Order } from './orders.model';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @ApiOperation({
    summary: 'Create orders',
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: OrderDto })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: HttpErrorResponseDto,
    description: 'Internal server error',
  })
  @Post()
  async create(@Body() order: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(order);
  }

  @ApiOperation({
    summary: 'Get all orders',
  })
  @ApiResponse({ status: HttpStatus.OK, type: [OrderDto] })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: HttpErrorResponseDto,
    description: 'Internal server error',
  })
  @ApiQuery({ name: 'code', required: false, type: [String] })
  @Get()
  async findAll(@Query('code') code: Array<string>): Promise<Order[]> {
    return this.ordersService.findAll(code);
  }

  @ApiOperation({
    summary: 'Count orders',
  })
  @ApiResponse({ status: HttpStatus.OK, type: Number })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: HttpErrorResponseDto,
    description: 'Internal server error',
  })
  @Get('count')
  async count(): Promise<number> {
    return this.ordersService.count();
  }

  @ApiOperation({
    summary: 'Find one order',
  })
  @ApiResponse({ status: HttpStatus.OK, type: OrderDto })
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
  @ApiParam({ name: 'id', description: 'id of order' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @ApiOperation({
    summary: 'Delete one order',
  })
  @ApiResponse({ status: HttpStatus.OK, type: OrderDto })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: HttpErrorResponseDto,
    description: 'Internal server error',
  })
  @ApiParam({ name: 'id', description: 'id of order' })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Order> {
    return this.ordersService.delete(id);
  }

  @ApiOperation({
    summary: 'Update one order',
  })
  @ApiResponse({ status: HttpStatus.OK, type: OrderDto })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    type: HttpErrorResponseDto,
    description: 'Internal server error',
  })
  @ApiParam({ name: 'id', description: 'id of order' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() order: UpdateOrderDto,
  ): Promise<Order> {
    return this.ordersService.update(id, order);
  }
}
