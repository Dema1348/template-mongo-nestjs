import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from 'nestjs-typegoose';

import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

describe('OrdersController', () => {
  let ordersService: OrdersService;
  let ordersController: OrdersController;

  beforeEach(async () => {
    const ordersModule: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [OrdersController],
      providers: [
        OrdersService,
        {
          provide: getModelToken('Order'),
          useValue: jest.fn(),
        },
      ],
    }).compile();

    ordersService = ordersModule.get<OrdersService>(OrdersService);
    ordersController = ordersModule.get<OrdersController>(OrdersController);
  });

  it('should be defined', () => {
    expect(ordersController).toBeDefined();
    expect(ordersService).toBeDefined();
  });

  describe('function create', () => {
    it('return new object', async () => {
      const order = {
        code: '123456789',
      };
      jest
        .spyOn(ordersService, 'create')
        .mockImplementation(() => Promise.resolve(order));
      const response = await ordersController.create(order);
      expect(response.code).toEqual('123456789');
    });
  });

  describe('function findAll', () => {
    it('find all objects', async () => {
      const orderOne = {
        code: '123456789',
      };

      const orderTwo = {
        code: 'X2345678X',
      };

      const orderThree = {
        code: 'A2345678A',
        orders: ['32323223233'],
      };

      jest
        .spyOn(ordersService, 'findAll')
        .mockImplementation(() =>
          Promise.resolve([orderOne, orderTwo, orderThree]),
        );

      const code = ['A2345678A'];
      const response = await ordersController.findAll(code);
      expect(response.length).toEqual(3);
    });
  });

  describe('function findOne', () => {
    it('find one object', async () => {
      const order = {
        code: '123456789',
      };

      jest
        .spyOn(ordersService, 'findOne')
        .mockImplementation(() => Promise.resolve(order));

      const response = await ordersController.findOne(
        '5ff61d13c2feaf104339939c',
      );
      expect(response.code).toEqual('123456789');
    });
  });

  describe('function delete', () => {
    it('delete object', async () => {
      const order = {
        code: '123456789',
      };
      jest
        .spyOn(ordersService, 'delete')
        .mockImplementation(() => Promise.resolve(order));

      const response = await ordersController.delete(
        '5ff61d13c2feaf104339939c',
      );
      expect(response.code).toEqual('123456789');
    });
  });

  describe('function update', () => {
    it('update object', async () => {
      const orderUpdate = {
        code: '123456789',
      };
      jest
        .spyOn(ordersService, 'update')
        .mockImplementation(() => Promise.resolve(orderUpdate));

      const response = await ordersController.update(
        '5ff61d13c2feaf104339939c',
        orderUpdate,
      );
      expect(response.code).toEqual('123456789');
    });
  });

  describe('function count', () => {
    it('count objects', async () => {
      const count = 1;
      jest
        .spyOn(ordersService, 'count')
        .mockImplementation(() => Promise.resolve(count));

      const response = await ordersController.count();
      expect(response).toEqual(1);
    });
  });
});
