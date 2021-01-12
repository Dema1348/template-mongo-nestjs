import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Item } from './items.model';
import { NOT_FOUND_ERROR } from '../utils/errors/notFound';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item) private readonly itemModel: ReturnModelType<typeof Item>,
  ) {}

  async create(item: Item): Promise<Item> {
    const createdItem = new this.itemModel(item);
    return createdItem.save();
  }

  async findAll(
    stock: string,
    tags: Array<string>,
    name: string,
  ): Promise<Item[]> {
    const filters: any = {};
    if (stock) {
      filters.stock = stock;
    }
    if (tags) {
      filters.tags = { $all: tags };
    }
    if (name) {
      filters.name = { $regex: name };
    }
    return this.itemModel.find(filters);
  }

  async findOne(id: string): Promise<Item> {
    const doc = await this.itemModel.findOne({ _id: id });
    if (!doc) {
      throw new HttpException(NOT_FOUND_ERROR.message, NOT_FOUND_ERROR.status);
    }
    return doc;
  }

  async delete(id: string): Promise<Item> {
    const doc = await this.itemModel.findByIdAndRemove(id);
    if (!doc) {
      throw new HttpException(NOT_FOUND_ERROR.message, NOT_FOUND_ERROR.status);
    }
    return doc;
  }

  async update(id: string, item: Item): Promise<Item> {
    const doc = await this.itemModel.findByIdAndUpdate(id, item, { new: true });
    if (!doc) {
      throw new HttpException(NOT_FOUND_ERROR.message, NOT_FOUND_ERROR.status);
    }
    return doc;
  }

  async count(): Promise<number> {
    return this.itemModel.estimatedDocumentCount();
  }
}
