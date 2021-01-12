import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from 'nestjs-typegoose';
import { getModelForClass, mongoose } from '@typegoose/typegoose';

import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { Item } from './items.model';

describe('ItemsService', () => {
  let itemsService: ItemsService;

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

    const itemsModule: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [ItemsController],
      providers: [
        ItemsService,
        {
          provide: getModelToken('Item'),
          useValue: ItemModel,
        },
      ],
    }).compile();

    itemsService = itemsModule.get<ItemsService>(ItemsService);
    await ItemModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should be defined', () => {
    expect(itemsService).toBeDefined();
  });

  describe('function create', () => {
    it('return new object', async () => {
      const item = {
        name: 'example',
        stock: 1,
        tags: ['red'],
      };
      const response = await itemsService.create(item);

      expect(response.name).toEqual('example');
      expect(response.stock).toEqual(1);
      expect(Array.from(response.tags)).toEqual(['red']);
    });
  });

  describe('function findAll', () => {
    beforeEach(async () => {
      const itemOne = {
        name: 'example',
        stock: 1,
        tags: ['red'],
      };
      await itemsService.create(itemOne);

      const itemTwo = {
        name: 'example',
        stock: 0,
        tags: ['red', 'blue'],
      };
      await itemsService.create(itemTwo);

      const itemThree = {
        name: 'otherName',
        stock: 0,
        tags: ['blue'],
      };
      await itemsService.create(itemThree);
    });

    it('find all objects', async () => {
      const stock = null;
      const tags = null;
      const name = null;
      const response = await itemsService.findAll(stock, tags, name);
      expect(response.length).toEqual(3);
    });

    it('find all objects with all filters', async () => {
      const stock = '1';
      const tags = ['red'];
      const name = 'example';
      const response = await itemsService.findAll(stock, tags, name);
      expect(response.length).toEqual(1);
    });

    it('find all objects with one filter', async () => {
      const stock = '0';
      const tags = null;
      const name = null;
      const response = await itemsService.findAll(stock, tags, name);
      expect(response.length).toEqual(2);
    });

    it('find all objects with one filters in array', async () => {
      const stock = null;
      const tags = ['blue', 'red'];
      const name = null;
      const response = await itemsService.findAll(stock, tags, name);
      expect(response.length).toEqual(1);
    });
  });

  describe('function findOne', () => {
    it('find one object', async () => {
      const item = {
        name: 'example',
        stock: 1,
        tags: ['red'],
      };
      const responseCreate: any = await itemsService.create(item);
      const response = await itemsService.findOne(responseCreate.id);
      expect(response.name).toEqual('example');
      expect(response.stock).toEqual(1);
      expect(Array.from(response.tags)).toEqual(['red']);
    });

    it('find an object that doesnt exist', async () => {
      const id = '5ff61d13c2feaf104339939c';
      try {
        await itemsService.findOne(id);
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(error.message).toEqual('No docs found!');
      }
    });
  });

  describe('function delete', () => {
    it('delete object', async () => {
      const item = {
        name: 'example',
        stock: 1,
        tags: ['red'],
      };
      const responseCreate: any = await itemsService.create(item);
      const response = await itemsService.delete(responseCreate.id);
      expect(response.name).toEqual('example');
      expect(response.stock).toEqual(1);
      expect(Array.from(response.tags)).toEqual(['red']);
    });

    it('delete object that doesnt exist', async () => {
      const id = '5ff61d13c2feaf104339939c';
      try {
        await itemsService.delete(id);
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(error.message).toEqual('No docs found!');
      }
    });
  });

  describe('function update', () => {
    it('update object', async () => {
      const item = {
        name: 'example',
        stock: 1,
        tags: ['red'],
      };
      const responseCreate: any = await itemsService.create(item);
      const itemUpdate = {
        name: 'exampleUpdate',
        stock: 2,
        tags: ['black', 'blue'],
      };
      const response = await itemsService.update(responseCreate.id, itemUpdate);
      expect(response.name).toEqual('exampleUpdate');
      expect(response.stock).toEqual(2);
      expect(Array.from(response.tags)).toEqual(['black', 'blue']);
    });

    it('update object that doesnt exist', async () => {
      const id = '5ff61d13c2feaf104339939c';
      const itemUpdate = {
        name: 'exampleUpdate',
        stock: 2,
        tags: ['black', 'blue'],
      };
      try {
        await itemsService.update(id, itemUpdate);
      } catch (error) {
        expect(error.status).toEqual(404);
        expect(error.message).toEqual('No docs found!');
      }
    });
  });

  describe('function count', () => {
    it('count objects', async () => {
      const item = {
        name: 'example',
        stock: 1,
        tags: ['red'],
      };
      await itemsService.create(item);
      const response = await itemsService.count();
      expect(response).toEqual(1);
    });
  });
});
