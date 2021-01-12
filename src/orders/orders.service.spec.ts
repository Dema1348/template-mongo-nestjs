import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from 'nestjs-typegoose';
import { getModelForClass, mongoose } from '@typegoose/typegoose';

import { ItemsService } from '../items/items.service';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './orders.model';
import { Item } from '../items/items.model';

describe('OrdersService', () => {
  let ordersService: OrdersService;
  let itemsService: ItemsService;

  const OrderModel = getModelForClass(Order, {
    schemaOptions: {
      collection: `order-${Math.random().toString(36).substring(7)}`,
    },
  });

  const ItemModel = getModelForClass(Item, {
    schemaOptions: {
      collection: `item-${Math.random().toString(36).substring(7)}`,
    },
  });

  beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    const ordersModule: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [OrdersController],
      providers: [
        OrdersService,
        ItemsService,
        {
          provide: getModelToken('Order'),
          useValue: OrderModel,
        },
        {
          provide: getModelToken('Item'),
          useValue: ItemModel,
        },
      ],
    }).compile();

    ordersService = ordersModule.get<OrdersService>(OrdersService);
    itemsService = ordersModule.get<ItemsService>(ItemsService);
    await OrderModel.deleteMany({});
    await ItemModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should be defined', () => {
    expect(ordersService).toBeDefined();
  });

  describe('function create', () => {
    it('return new object', async () => {
      const order = {
        code: '123456789',
      };
      const response = await ordersService.create(order);

      expect(response.code).toEqual('123456789');
    });

    it('return new object with items', async () => {
      const item = {
        name: 'example',
        stock: 1,
        tags: ['red'],
      };

      const newItem: any = await itemsService.create(item);

      const order = {
        code: '123456789',
        items: [newItem.id],
      };
      const response = await ordersService.create(order);
      expect(response.code).toEqual('123456789');
      expect(JSON.parse(JSON.stringify(response.items))).toEqual([newItem.id]);
    });
  });

  describe('function findAll', () => {
    beforeEach(async () => {
      const orderOne = {
        code: '123456789',
      };
      await ordersService.create(orderOne);

      const orderTwo = {
        code: 'X2345678X',
      };
      await ordersService.create(orderTwo);

      const item = {
        name: 'example',
        stock: 1,
        tags: ['red'],
      };

      const newItem: any = await itemsService.create(item);

      const orderThree = {
        code: 'A2345678A',
        items: [newItem.id],
      };
      await ordersService.create(orderThree);
    });

    it('find all objects', async () => {
      const code = null;
      const response = await ordersService.findAll(code);
      expect(response.length).toEqual(3);
    });

    it('find all objects with all filters', async () => {
      const code = ['A2345678A'];
      const response = await ordersService.findAll(code);
      expect(response.length).toEqual(1);
    });

    it('find all objects and check pupulate', async () => {
      const code = ['A2345678A'];
      const response = await ordersService.findAll(code);
      expect(JSON.parse(JSON.stringify(response))).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: 'A2345678A',
            items: expect.arrayContaining([
              expect.objectContaining({
                name: 'example',
                stock: 1,
                tags: ['red'],
              }),
            ]),
          }),
        ]),
      );
    });
  });

  describe('function findOne', () => {
    it('find one object', async () => {
      const order = {
        code: '123456789',
      };
      await ordersService.create(order);
      const responseCreate: any = await ordersService.create(order);
      const response = await ordersService.findOne(responseCreate.id);
      expect(response.code).toEqual('123456789');
    });

    it('find an object that doesnt exist', async () => {
      const id = '5ff61d13c2feaf104339939c';
      try {
        await ordersService.findOne(id);
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(error.message).toEqual('No docs found!');
      }
    });
  });

  describe('function delete', () => {
    it('delete object', async () => {
      const order = {
        code: '123456789',
      };
      const responseCreate: any = await ordersService.create(order);
      const response = await ordersService.delete(responseCreate.id);
      expect(response.code).toEqual('123456789');
    });

    it('delete object that doesnt exist', async () => {
      const id = '5ff61d13c2feaf104339939c';
      try {
        await ordersService.delete(id);
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(error.message).toEqual('No docs found!');
      }
    });
  });

  describe('function update', () => {
    it('update object', async () => {
      const order = {
        code: '123456789',
      };
      const responseCreate: any = await ordersService.create(order);
      const orderUpdate = {
        code: '1111111',
      };
      const response = await ordersService.update(
        responseCreate.id,
        orderUpdate,
      );
      expect(response.code).toEqual('1111111');
    });

    it('update object that doesnt exist', async () => {
      const id = '5ff61d13c2feaf104339939c';
      const orderUpdate = {
        code: '1111111',
      };
      try {
        await ordersService.update(id, orderUpdate);
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(error.message).toEqual('No docs found!');
      }
    });
  });

  describe('function count', () => {
    it('count objects', async () => {
      const order = {
        code: '123456789',
      };
      await ordersService.create(order);
      const response = await ordersService.count();
      expect(response).toEqual(1);
    });
  });
});
