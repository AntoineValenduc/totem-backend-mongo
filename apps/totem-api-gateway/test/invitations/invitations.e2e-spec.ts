import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TotemApiGatewayModule } from '../../src/totem-api-gateway.module';
import { mockTcpClient } from '../mocks/mock-tcp-client';
import { HttpService } from '@nestjs/axios';
import { mockHttpService } from '../mocks/mock-http-service';

describe('InvitationsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TotemApiGatewayModule],
    })
      .overrideProvider('TOTEM_MONGO_CLIENT')
      .useValue(mockTcpClient)
      .overrideProvider(HttpService)
      .useValue(mockHttpService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Invitation full => Un chef invite un jeune', async () => {
    const payload = {
      email: 'jeune@example.com',
      role: 'JEUNE',
      profile: {
        first_name: 'Test',
        last_name: 'Jeune',
        date_of_birth: '2005-01-01',
        address: '1 rue Test',
        zipcode: '75000',
        city: 'Paris',
        mail: 'second@example.com',
        phone_number: '0600000000',
        photo_url: '',
        branch: 'branch123',
      },
    };

    return request(app.getHttpServer())
      .post('/api/invitations/full')
      .send(payload)
      .expect(201)
      .expect(res => {
        expect(res.body).toHaveProperty('token');
      });
  });

  it('Invitations => crée une invitation simple', async () => {
    await request(app.getHttpServer())
      .post('/api/invitations')
      .send({ email: 'simple@example.com', role: 'CHEF' })
      .expect(201)
      .expect(res => {
        expect(res.body).toHaveProperty('success', true);
      });
  });

  it('Validate => valide un token', async () => {
    await request(app.getHttpServer())
      .get('/api/invitations/validate')
      .query({ token: 'abc123' })
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveProperty('valid', true);
      });
  });

  /*it('Register => enregistre un compte', async () => {
    await request(app.getHttpServer())
      .post('/api/invitations/register')
      .send({ token: 'abc123', password: 'secure123' })
      .expect(201)
      .expect(res => {
        expect(res.body).toHaveProperty('userId', 'user123');
      });
  });*/

  afterAll(async () => {
    await app.close();
  });
});

//{
//  "moduleFileExtensions": ["js", "json", "ts"],
//  "rootDir": ".",
//  "testEnvironment": "node",
//  "testRegex": "invitations/invitations.e2e-spec.ts$",
//  "transform": {
//    "^.+\\.(t|j)s$": "ts-jest"
//  }
//}
