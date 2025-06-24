import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TotemAuthSqlModule } from './../src/totem-auth-sql.module';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';

describe('TotemAuthSqlController (e2e)', () => {
  let app: INestApplication;
  jest.setTimeout(30000);

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TotemAuthSqlModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('works', () => {
    expect(true).toBe(true);
  });
});
