import { TerminusModule } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  let healthController: HealthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule],
      controllers: [HealthController],
      providers: [HealthService],
    }).compile();

    healthController = app.get<HealthController>(HealthController);
  });

  describe('root', () => {
    it('should return "Ok!"', () => {
      expect(healthController.getOk()).toBe('Ok!');
    });

    it('should return health', () => {
      expect(healthController.getHealthCheck().service).toBe('ms-template');
      expect(healthController.getHealthCheck().environment).toBe('test');
    });

    it('should return health dns', async () => {
      expect((await healthController.getCheckDns()).status).toBe('ok');
    });
  });
});
