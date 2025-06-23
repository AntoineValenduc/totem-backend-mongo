import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TotemAuthSqlModule } from './../src/totem-auth-sql.module';

describe('TotemAuthSqlController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TotemAuthSqlModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('works', () => {
    expect(true).toBe(true);
  });
});
