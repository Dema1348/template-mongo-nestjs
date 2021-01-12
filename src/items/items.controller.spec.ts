import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from 'nestjs-typegoose';

import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';

describe('ItemsController', () => {
  let itemsService: ItemsService;
  let itemsController: ItemsController;

  beforeEach(async () => {
    const itemsModule: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [ItemsController],
      providers: [
        ItemsService,
        {
          provide: getModelToken('Item'),
          useValue: jest.fn(),
        },
      ],
    }).compile();

    itemsService = itemsModule.get<ItemsService>(ItemsService);
    itemsController = itemsModule.get<ItemsController>(ItemsController);
  });

  it('should be defined', () => {
    expect(itemsController).toBeDefined();
    expect(itemsService).toBeDefined();
  });

  describe('function create', () => {
    it('return new object', async () => {
      const item = {
        name: 'example',
        stock: 1,
        tags: ['red'],
      };
      jest
        .spyOn(itemsService, 'create')
        .mockImplementation(() => Promise.resolve(item));
      const response = await itemsController.create(item);
      expect(response.name).toEqual('example');
      expect(response.stock).toEqual(1);
      expect([...response.tags]).toEqual(['red']);
    });
  });

  describe('function findAll', () => {
    it('find all objects', async () => {
      const itemOne = {
        name: 'example',
        stock: 1,
        tags: ['red'],
      };
      const itemTwo = {
        name: 'example',
        stock: 0,
        tags: ['red', 'blue'],
      };
      const itemThree = {
        name: 'otherName',
        stock: 0,
        tags: ['blue'],
      };

      jest
        .spyOn(itemsService, 'findAll')
        .mockImplementation(() =>
          Promise.resolve([itemOne, itemTwo, itemThree]),
        );

      const stock = null;
      const tags = null;
      const name = null;
      const response = await itemsController.findAll(stock, tags, name);
      expect(response.length).toEqual(3);
    });
  });

  describe('function findOne', () => {
    it('find one object', async () => {
      const item = {
        name: 'example',
        stock: 1,
        tags: ['red'],
      };

      jest
        .spyOn(itemsService, 'findOne')
        .mockImplementation(() => Promise.resolve(item));

      const response = await itemsController.findOne(
        '5ff61d13c2feaf104339939c',
      );
      expect(response.name).toEqual('example');
      expect(response.stock).toEqual(1);
      expect([...response.tags]).toEqual(['red']);
    });
  });

  describe('function delete', () => {
    it('delete object', async () => {
      const item = {
        name: 'example',
        stock: 1,
        tags: ['red'],
      };
      jest
        .spyOn(itemsService, 'delete')
        .mockImplementation(() => Promise.resolve(item));

      const response = await itemsController.delete('5ff61d13c2feaf104339939c');
      expect(response.name).toEqual('example');
      expect(response.stock).toEqual(1);
      expect([...response.tags]).toEqual(['red']);
    });
  });

  describe('function update', () => {
    it('update object', async () => {
      const itemUpdate = {
        name: 'exampleUpdate',
        stock: 2,
        tags: ['black', 'blue'],
      };
      jest
        .spyOn(itemsService, 'update')
        .mockImplementation(() => Promise.resolve(itemUpdate));

      const response = await itemsController.update(
        '5ff61d13c2feaf104339939c',
        itemUpdate,
      );
      expect(response.name).toEqual('exampleUpdate');
      expect(response.stock).toEqual(2);
      expect([...response.tags]).toEqual(['black', 'blue']);
    });
  });

  describe('function count', () => {
    it('count objects', async () => {
      const count = 1;
      jest
        .spyOn(itemsService, 'count')
        .mockImplementation(() => Promise.resolve(count));

      const response = await itemsController.count();
      expect(response).toEqual(1);
    });
  });
});
