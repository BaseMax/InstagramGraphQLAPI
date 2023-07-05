import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaClient, User } from '@prisma/client';
import { PrismaService } from '../src/modules/prisma/prisma.service';
import { UserService } from '../src/modules/user/user.service';
import { AuthService } from '../src/modules/auth/auth.service';

const gql = '/graphql';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let userService: UserService;
  let authService: AuthService;
  let users: User[];
  let user: User;
  let userToChangePass: any;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    prisma = app.get(PrismaService);
    userService = app.get(UserService);
    authService = app.get(AuthService);
    await app.init();
    let registrationResult = await authService.register({
      username: 'ali-dehghan',
      name: 'ali',
      password: 'ali@ali',
      phonenumber: '0927892982',
      bio: 'hi im ali',
    });
    let { userCreated, token } = registrationResult;
    userToChangePass = userCreated;
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
    it('should reset password successfully ', async () => {
      const username = 'ali-dehghan';
      const oldPassword = 'ali@ali';
      const newPassword = 'ali123321';
      const passwordConfirm = 'ali123321';
      const phonenumber = '0927892982';
      // Act
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation {
            ResetPassword(input: { username: "${username}", phonenumber: "${phonenumber}" , newPassword : "${newPassword}" , passwordConfirm : "${passwordConfirm}" ,oldPassword :"${oldPassword}" }) {
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
      expect(response.body.data.ResetPassword.token).toBeDefined();
      expect(response.body.data.ResetPassword.id).toBe(userToChangePass.id);
      expect(response.body.data.ResetPassword.username).toBe(
        userToChangePass.username,
      );
    });
    it('should not change password with not matching new password and password confirm ', async () => {
      const username = 'ali-dehghan';
      const oldPassword = 'ali@ali';
      const newPassword = 'ali123321';
      const passwordConfirm = 'ali123456';
      const phonenumber = '09151339390';
      // Act
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation {
            ResetPassword(input: { username: "${username}", phonenumber: "${phonenumber}" , newPassword : "${newPassword}" , passwordConfirm : "${passwordConfirm}" , oldPassword: "${oldPassword}" }) {
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
    it('should not change password with incorrect oldpassword ', async () => {
      const username = 'ali-dehghan';
      const oldPassword = 'ali9090';
      const newPassword = 'ali123321';
      const passwordConfirm = 'ali123456';
      const phonenumber = '09151339390';
      // Act
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation {
            ResetPassword(input: { username: "${username}", phonenumber: "${phonenumber}" , newPassword : "${newPassword}" , passwordConfirm : "${passwordConfirm}" , oldPassword : "${oldPassword}" }) {
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

  describe('user getting profile query', () => {
    it('getting profile successfuly with a valid id', async () => {
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          query {
            getUserProfile(id : ${users[0].id}) {
              id
              name
              username
              bio
              status
              phonenumber
            }
          }
        `,
        });
      expect(response.status).toBe(200);
      expect(response.body.data).not.toBeNull();
      expect(response.body.data.getUserProfile.username).toBe(
        users[0].username,
      );
      expect(response.body.data.getUserProfile.phonenumber).toBe(
        users[0].phonenumber,
      );
    });
    it('should not get profile with incorrect id', async () => {
      const invalidId = '9999';
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          query {
            getUserProfile(id : ${invalidId}) {
              id
              name
              username
              bio
              status
              phonenumber
            }
          }
        `,
        });
      expect(response.status).toBe(200);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors[0].extensions.code).toBe('BAD_REQUEST');
    });
  });

  describe('follow user mutation', () => {
    it('should successfully follow', async () => {
      // Act
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation {
            followUser( ToFollowId: ${String(
              users[0].id,
            )}, wantFollowId: ${String(users[1].id)} ) {
                id
                name
                username
                password
                phonenumber
                bio
                status
            }
          }
        `,
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).not.toBeNull();
      expect(response.body.data.followUser[1].id).toBe(String(users[0].id));
      expect(response.body.data.followUser[1].username).toBe(users[0].username);
    });

    it('should not  follow with invalid ids', async () => {
      // Act
      const toFollowInvalid = '99990';
      const wantToFollowInvalid = '888880';
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          mutation {
            followUser( ToFollowId: ${toFollowInvalid}, wantFollowId: ${wantToFollowInvalid} ) {
                id
                name
                username
                password
                phonenumber
                bio
                status
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

  describe('listFollowers query', () => {
    it('should successfully list followers of a user', async () => {
      // Act
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          query {
            listFollowers(id :${user.id} ) {
              id
              name
              username
              password
              phonenumber
              bio
              status
            }
          }
        `,
        });

      // Assert

      expect(response.status).toBe(200);
      expect(response.body.data).not.toBeNull();
      expect(Array.isArray(response.body.data.listFollowers)).toBe(true);
    });

    it('should not get list followers of a user with invalid id', async () => {
      // Act
      const invalidId = '9899898';
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          query {
            listFollowers(id :${invalidId} ) {
              id
              name
              username
              password
              phonenumber
              bio
              status
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

  describe('listFollowedBy query', () => {
    it('should successfully list Followed By of a user', async () => {
      // Act
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          query {
            listFollowedBy(id :${user.id} ) {
              id
              name
              username
              password
              phonenumber
              bio
              status
            }
          }
        `,
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).not.toBeNull();
      expect(Array.isArray(response.body.data.listFollowedBy)).toBe(true);
    });

    it('should not get list Followed By of a user with invalid id', async () => {
      // Act
      const invalidId = '9899898';
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          query {
            listFollowedBy(id :${invalidId} ) {
              id
              name
              username
              password
              phonenumber
              bio
              status
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

  describe('getByUserName query', () => {
    it('should successfully get by user name', async () => {
      // Act
      const username = 'pooya-dehghan';
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          query {
            getByUserName(username : "${username}" ) {
              id
              name
              username
              password
              phonenumber
              bio
              status
            }
          }
        `,
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).not.toBeNull();
      expect(response.body.data.getByUserName.username).toBe(username);
    });
    it('should not get user by invalid username', async () => {
      // Act
      const username = 'pooya-dehghan-____---___';
      const response = await request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
          query {
            getByUserName(username : "${username}" ) {
              id
              name
              username
              password
              phonenumber
              bio
              status
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

  
  afterAll(async () => {
    const deletedUserToChangePass = await prisma.user.delete({
      where: {
        username: 'ali-dehghan',
      },
    });
    await app.close();
    await prisma.$disconnect();
  });
});
