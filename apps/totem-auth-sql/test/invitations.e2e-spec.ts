import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { TotemAuthSqlModule } from '../src/totem-auth-sql.module';
import { decode } from 'quoted-printable';
import { ProfileService } from '../../totem-mongo/src/services/profile.service';

// Variables d'env.test
process.env.JWT_SECRET_TEST = process.env.JWT_SECRET_TEST ?? 'test_secret';
process.env.POSTGRES_URL_TEST =
  process.env.POSTGRES_URL_TEST ??
  'postgresql://postgres:postgres@localhost:5432/totem_auth_sql_test?schema=public';

// Mocks
// ATTENTION pas d Mock pour le serviceMail pour permettre l'envoi de mail réel ave MailHog
const mockProfileService: Partial<ProfileService> = {
  create: jest.fn().mockResolvedValue({}),
};

describe('Invitations E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  jest.setTimeout(30000);

  const testEmail = 'test@example.com';

  const dto = {
    email: testEmail,
    role: 'JEUNE',
    profile: {
      first_name: 'Test',
      last_name: 'User',
      date_of_birth: '2000-01-01',
      address: '1 rue des tests',
      zipcode: '75000',
      city: 'Paris',
      phone_number: '0600000000',
      branch: '',
    },
  };

  beforeAll(async () => {
    // Nettoyage anciens mails dans MailHog
    await axios.delete('http://localhost:8025/api/v1/messages');

    // Création Module de test
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TotemAuthSqlModule],
    })
      .overrideProvider(ProfileService)
      .useValue(mockProfileService)
      .compile();

      // Démarrage app
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    // Nettoyage BDD
    if (prisma && typeof prisma.user?.deleteMany === 'function') {
      await prisma.user.deleteMany({ where: { email: testEmail } });
    }

    // Fermeture app
    if (app && typeof app.close === 'function') {
      await app.close();
    }
  });

  it('Créer un utilisateur et un profil', async () => {
    const res = await request(app.getHttpServer())
      .post('/invitations/register')
      .send(dto)
      .expect(201);

    const body = res.body as { message: string };
    expect(body.message).toBe('Invitation envoyée');
  });

  it('Echec si email existe déjà', async () => {
    const res = await request(app.getHttpServer())
      .post('/invitations/register')
      .send(dto)
      .expect(400);

    const body = res.body as { message: string };
    expect(body.message).toMatch(/déjà utilisé/i);
  });

  it('Envoie et réception du mail avec un lien de première connexion', async () => {
    const testEmail = `user${Date.now()}@test.com`;

    const dto = {
      email: testEmail,
      role: 'JEUNE',
      profile: {
        first_name: 'Test',
        last_name: 'Mailhog',
        city: 'Testville',
        address: '1 rue test',
        date_of_birth: '1990-01-01',
        zipcode: '00000',
        phone_number: '0600000000',
        branch: 'TEST',
      },
    };

    // Envoie Invitation
    await request(app.getHttpServer())
      .post('/invitations/register')
      .send(dto)
      .expect(201);

    const email = await waitForEmail(testEmail);

    // Décodage du contenu
    const decodedBody = decode(email.Content.Body).toString('utf-8');

    // Vérification présence du lien "première connection"
    expect(decodedBody).toContain('Cliquez ici pour vous connecter');
  });


  /**
   * Temps d'attente du mail dans MailHog
   * @param to - Email attendu
   * @param maxAttempts - Nbr max tentatives
   * @param delay - Délai entre tentatives
   */
  async function waitForEmail(to: string, maxAttempts = 15, delay = 1000) {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const res = await axios.get('http://localhost:8025/api/v2/messages');

        const messages = res.data?.items ?? [];

        // Parcourt des mails reçus
        for (const msg of messages) {
          // Check dans msg.To (pas dans Headers)
          const allRecipients = msg.To?.map((entry: any) =>
            `${entry.Mailbox}@${entry.Domain}`
          ) ?? [];

          if (allRecipients.some((email) => email.toLowerCase() === to.toLowerCase())) {
            return msg;
          }
        }
      } catch (err) {
        console.error('Erreur MailHog :', err.message);
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    throw new Error(`Mail non reçu pour ${to}`);
  }

});
