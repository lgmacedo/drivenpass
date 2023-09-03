import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { UserFactory } from './factories/user.factory';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService = new PrismaService();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await prisma.card.deleteMany();
    await prisma.credential.deleteMany();
    await prisma.note.deleteMany();
    await prisma.user.deleteMany();

    await app.init();
  });

  async function generateAuthenticatedUser() {
    const signUp = await UserFactory.build(
      prisma,
      undefined,
      'strongPassw0rd!',
    );

    //signing in the user created
    const signIn = await request(app.getHttpServer())
      .post('/users/sign-in')
      .send({
        email: signUp.email,
        password: 'strongPassw0rd!',
      });

    return {
      id: signUp.id,
      token: signIn.body.token,
    };
  }

  it('POST/users/sign-up should return status code 201 when given data is alright', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/sign-up')
      .send({
        email: 'johndoe@mail.com',
        password: 'strongPassw0rd!',
      });

    expect(response.statusCode).toBe(201);
  });

  it('POST/users/sign-up should return status code 409 when given email is already being used', async () => {
    await UserFactory.build(prisma, 'johndoe@mail.com');

    const response = await request(app.getHttpServer())
      .post('/users/sign-up')
      .send({
        email: 'johndoe@mail.com',
        password: 'strongPassw0rd!',
      });

    expect(response.statusCode).toBe(409);
  });

  it("POST/users/sign-up should return status code 400 when given password isn't strong enough", async () => {
    const response = await request(app.getHttpServer())
      .post('/users/sign-up')
      .send({
        email: 'johndoe@mail.com',
        password: '123456',
      });

    expect(response.statusCode).toBe(400);
  });

  it('POST/users/sign-in should return status code 200 and a token', async () => {
    const user = await UserFactory.build(prisma, undefined, 'strongPassw0rd!');

    const response = await request(app.getHttpServer())
      .post('/users/sign-in')
      .send({
        email: user.email,
        password: 'strongPassw0rd!',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ token: expect.any(String) });
  });

  it("POST/users/sign-in should return status code 401 when credentials don't match", async () => {
    const user = await UserFactory.build(prisma, undefined, 'strongPassw0rd!');

    const response = await request(app.getHttpServer())
      .post('/users/sign-in')
      .send({
        email: user.email,
        password: 'wrongPassw0rd!',
      });

    expect(response.statusCode).toBe(401);
  });

  it('DELETE/erase should return status code 200 when user is successfully deleted', async () => {
    const user = await generateAuthenticatedUser();

    const response = await request(app.getHttpServer())
      .delete('/erase')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        password: 'strongPassw0rd!',
      });

    expect(response.statusCode).toBe(200);
  });

  it('DELETE/erase should return status code 401 when password does not match', async () => {
    const user = await generateAuthenticatedUser();

    const response = await request(app.getHttpServer())
      .delete('/erase')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        password: 'wrongPassw0rd!',
      });

    expect(response.statusCode).toBe(401);
  });
});
