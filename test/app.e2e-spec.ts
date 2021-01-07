import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', async () => {
    const { status, text } = await request(app.getHttpServer()).get('/');
    expect(status).toBe(200);
    expect(text).toBe('Ok!');
  });

  it('/health (GET)', async () => {
    const { status, body } = await request(app.getHttpServer()).get('/health');
    expect(status).toBe(200);
    expect(body.service).toBe('ms-alexa');
    expect(body.environment).toBe('test');
  });
});
