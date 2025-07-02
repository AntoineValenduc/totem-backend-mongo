import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TotemAuthSqlModule } from '../src/totem-auth-sql.module';

describe('Invitations (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TotemAuthSqlModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/invitations/register (POST) should send an email', async () => {
    const res = await request(app.getHttpServer())
      .post('/invitations/register')
      .send({
        email: 'test@mailhog.local',
        role: 'JEUNE',
        profile: {
          first_name: 'Test',
          last_name: 'User',
          date_of_birth: '2000-01-01',
          address: 'Rue Test',
          zipcode: '75000',
          city: 'Paris',
          email: 'test@mailhog.local',
          phone_number: '0600000000',
        },
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'Invitation envoyée');
    if (res.status !== 201) {
      console.error(res.body);
    }
  });

  afterAll(async () => {
    await app.close();
  });
});
