import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Order } from './orders.model';
import { NOT_FOUND_ERROR } from '../utils/errors/notFound';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order)
    private readonly orderModel: ReturnModelType<typeof Order>,
  ) {}

  async create(order: Order): Promise<Order> {
    const createdOrder = new this.orderModel(order);
    return createdOrder.save();
  }

  async findAll(code: Array<string>): Promise<Order[]> {
    const filters: any = {};
    if (code) {
      filters.code = { $in: code };
    }

    return this.orderModel.find(filters).populate('items');
  }

  async findOne(id: string): Promise<Order> {
    const doc = await this.orderModel.findOne({ _id: id }).populate('items');
    if (!doc) {
      throw new HttpException(NOT_FOUND_ERROR.message, NOT_FOUND_ERROR.status);
    }
    return doc;
  }

  async delete(id: string): Promise<Order> {
    const doc = await this.orderModel.findByIdAndRemove(id);
    if (!doc) {
      throw new HttpException(NOT_FOUND_ERROR.message, NOT_FOUND_ERROR.status);
    }
    return doc;
  }

  async update(id: string, order: Order): Promise<Order> {
    const doc = await this.orderModel.findByIdAndUpdate(id, order, {
      new: true,
    });
    if (!doc) {
      throw new HttpException(NOT_FOUND_ERROR.message, NOT_FOUND_ERROR.status);
    }
    return doc;
  }

  async count(): Promise<number> {
    return this.orderModel.estimatedDocumentCount();
  }
}
