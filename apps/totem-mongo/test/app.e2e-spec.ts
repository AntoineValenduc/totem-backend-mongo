import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TotemMongoModule } from './../src/totem-mongo.module';
import mongoose from 'mongoose';

describe('TotemMongoController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TotemMongoModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
    await mongoose.disconnect();
  });

  it('works', () => {
    expect(true).toBe(true);
  });
});
