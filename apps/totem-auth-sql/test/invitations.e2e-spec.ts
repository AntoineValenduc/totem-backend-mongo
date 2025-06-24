/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-redundant-type-constituents */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { TotemAuthSqlModule } from '../src/totem-auth-sql.module';
import { MailService } from '../src/mail/mail.service';
import { ProfileService } from '../../totem-mongo/src/services/profile.service';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';
process.env.POSTGRES_URL =
  process.env.POSTGRES_URL ||
  'postgresql://postgres:postgres@localhost:5432/totem_auth_sql_test?schema=public';

const mockProfileService: Partial<ProfileService> = {
  create: jest.fn().mockResolvedValue({}),
};

// Stop SMTP réels pour les tests
const mockMailService = {
  sendInvitation: jest.fn().mockResolvedValue(undefined),
};

describe('Invitations E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  jest.setTimeout(30000);

  const testEmail = 'test@example.com';

  const dto = {
    first_name: 'Test',
    last_name: 'User',
    date_of_birth: '2000-01-01',
    address: '1 rue des tests',
    zipcode: '75000',
    city: 'Paris',
    phone_number: '0600000000',
    email: testEmail,
    branch: 'BR001',
    role: 'JEUNE',
    password: 'temp123',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TotemAuthSqlModule],
    })
      .overrideProvider(ProfileService)
      .useValue(mockProfileService)
      .overrideProvider(MailService)
      .useValue(mockMailService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    if (prisma && typeof prisma.user?.deleteMany === 'function') {
      await prisma.user.deleteMany({ where: { email: testEmail } });
    }
    if (app && typeof app.close === 'function') {
      await app.close();
    }
  });

  it('✅ devrait créer un utilisateur et un profil', async () => {
    const res = await request(app.getHttpServer())
      .post('/invitations/register')
      .send(dto)
      .expect(201);

    const body = res.body as { message: string };
    expect(body.message).toBe('Invitation envoyée');
  });

  it('🚫 devrait échouer si l’mail existe déjà', async () => {
    const res = await request(app.getHttpServer())
      .post('/invitations/register')
      .send(dto)
      .expect(400);

    const body = res.body as { message: string };
    expect(body.message).toMatch(/déjà utilisé/i);
  });
});
