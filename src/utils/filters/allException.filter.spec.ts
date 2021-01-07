import { Test, TestingModule } from '@nestjs/testing';
import {
  HttpStatus,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { LoggerModule, getLoggerToken } from 'nestjs-pino';

import { AllExceptionsFilter } from './allException.filter';
import { AppController } from '../../app.controller';
import { AppService } from '../../app.service';

const mockJson = jest.fn();
const mockStatus = jest.fn().mockImplementation(() => ({
  json: mockJson,
}));
const mockGetResponse = jest.fn().mockImplementation(() => ({
  status: mockStatus,
}));
const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getResponse: mockGetResponse,
  getRequest: jest
    .fn()
    .mockImplementation(() => ({ request: 'test', method: 'get' })),
}));

const mockArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};

const ERROR_HTTP = {
  statusCode: HttpStatus.BAD_REQUEST,
  status: 'HTTP.STATUS_FAIL',
  message: 'Bad request',
};

describe('Validate exception filter', () => {
  let service: AllExceptionsFilter;

  beforeEach(async () => {
    jest.clearAllMocks();
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        LoggerModule.forRootAsync({
          useFactory: async () => {
            return {
              pinoHttp: {
                name: process.env.npm_package_name,
                level: 'silent',
                prettyPrint: false,
              },
            };
          },
        }),
      ],
      controllers: [AppController],
      providers: [
        AllExceptionsFilter,
        AppService,
        {
          provide: getLoggerToken('test'),
          useValue: {},
        },
      ],
    }).compile();

    service = app.get<AllExceptionsFilter>(AllExceptionsFilter);
  });

  describe('All exception filter tests', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('Http exception', () => {
      service.catch(
        new HttpException({ ...ERROR_HTTP }, ERROR_HTTP.statusCode),
        mockArgumentsHost,
      );
      expect(mockHttpArgumentsHost).toBeCalledTimes(1);
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockJson).toBeCalledTimes(1);
      expect(mockJson).toBeCalledWith({
        message: 'Bad request',
        status: 400,
      });
    });

    it('Http exception without message', () => {
      service.catch(
        new HttpException({}, ERROR_HTTP.statusCode),
        mockArgumentsHost,
      );
      expect(mockHttpArgumentsHost).toBeCalledTimes(1);
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockJson).toBeCalledTimes(1);
      expect(mockJson).toBeCalledWith({
        message: 'Http Exception',
        status: 400,
      });
    });

    it('Http exception with message in response ', () => {
      service.catch(
        new HttpException({ message: 'test' }, ERROR_HTTP.statusCode),
        mockArgumentsHost,
      );
      expect(mockHttpArgumentsHost).toBeCalledTimes(1);
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockJson).toBeCalledTimes(1);
      expect(mockJson).toBeCalledWith({
        message: 'test',
        status: 400,
      });
    });

    it('Internal server exception', () => {
      service.catch(new InternalServerErrorException(), mockArgumentsHost);
      expect(mockHttpArgumentsHost).toBeCalledTimes(1);
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockJson).toBeCalledTimes(1);
      expect(mockJson).toBeCalledWith({
        message: 'Internal server error: Internal Server Error',
        status: 500,
      });
    });

    it('Unknown server exception', () => {
      service.catch(new Error(), mockArgumentsHost);
      expect(mockHttpArgumentsHost).toBeCalledTimes(1);
      expect(mockGetResponse).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledTimes(1);
      expect(mockStatus).toBeCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockJson).toBeCalledTimes(1);
      expect(mockJson).toBeCalledWith({
        message: 'Internal server error: ',
        status: 500,
      });
    });
  });
});
