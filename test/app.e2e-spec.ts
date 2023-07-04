import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaClient, User } from '@prisma/client';
import { PrismaService } from '../src/modules/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

const gql = '/graphql';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let users: User[];
  let user: User;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    prisma = app.get(PrismaService);

    await app.init();
  });
  beforeEach(async () => {
    users = await prisma.user.findMany();
    user = await prisma.user.findUnique({
      where: {
        username: 'pooya',
      },
    });
  });
  describe('userLogin mutation', () => {
    it('should successfully login with valid credentials', async () => {
      // Arrange
      const username = 'pooya';
      const password = 'pooyadehghan';

      // Act
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation {
            userLogin(input: { username: "${username}", password: "${password}" }) {
                token
                username
                bio
                status
                phonenumber
                token
                id
            }
          }
        `,
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).not.toBeNull();
      expect(response.body.data.userLogin.token).toBeDefined();
      expect(response.body.data.userLogin.id).toBe(user.id);
      expect(response.body.data.userLogin.username).toBe(user.name);
    });

    it('should not login with invalid username', async () => {
      // Arrange
      const username = 'sajjad';
      const password = 'pooyadehghan';

      // Act
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation {
            userLogin(input: { username: "${username}", password: "${password}" }) {
              token
              username
              bio
              status
              phonenumber
              token
              id
            }
          }
        `,
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].extensions.code).toBe('BAD_REQUEST');
    });

    it('should not login with invalid password', async () => {
      // Arrange
      const username = 'pooya';
      const password = 'dehghan';

      // Act
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation {
            userLogin(input: { username: "${username}", password: "${password}" }) {
              token
              username
              bio
              status
              phonenumber
              token
              id
            }
          }
        `,
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].extensions.code).toBe('BAD_REQUEST');
    });
  });

  // describe('')

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });
});
