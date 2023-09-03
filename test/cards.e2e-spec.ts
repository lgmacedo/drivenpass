import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { UserFactory } from './factories/user.factory';
import { CardFactory } from './factories/card.factory';

describe('CardsController (e2e)', () => {
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

  it('POST/cards should return status code 201 when given data is alright', async () => {
    const user = await generateAuthenticatedUser();

    const response = await request(app.getHttpServer())
      .post('/cards')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        title: 'My credit card',
        number: '983727469826784',
        name: 'John Doe',
        code: '385',
        expiration: '03/33',
        password: 'card password',
        virtual: 'Virtual',
        type: 'Credit',
      });

    expect(response.statusCode).toBe(201);
  });

  it('POST/cards should return status code 400 when data is missing', async () => {
    const user = await generateAuthenticatedUser();

    const response = await request(app.getHttpServer())
      .post('/cards')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        title: 'My credit card',
        number: '983727469826784',
      });

    expect(response.statusCode).toBe(400);
  });

  it('POST/cards should return status code 409 when card already exists', async () => {
    const user = await generateAuthenticatedUser();

    const card = await CardFactory.build(prisma, undefined, user.id);

    const response = await request(app.getHttpServer())
      .post('/cards')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        title: card.title,
        number: '983727469826784',
        name: 'John Doe',
        code: '385',
        expiration: '03/33',
        password: 'card password',
        virtual: 'Virtual',
        type: 'Credit',
      });

    expect(response.statusCode).toBe(409);
  });

  it('GET/cards should return status code 200 and an array of cards', async () => {
    const user = await generateAuthenticatedUser();

    const card = await CardFactory.build(prisma, undefined, user.id);

    const response = await request(app.getHttpServer())
      .get('/cards')
      .set('Authorization', `Bearer ${user.token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([card]);
  });

  it('GET/cards/:id should return status code 403 when card does not belong to user', async () => {
    const user1 = await generateAuthenticatedUser();
    const user2 = await generateAuthenticatedUser();

    const card = await CardFactory.build(prisma, undefined, user2.id);

    const response = await request(app.getHttpServer())
      .get(`/cards/${card.id}`)
      .set('Authorization', `Bearer ${user1.token}`);

    expect(response.statusCode).toBe(403);
  });

  it('GET/cards/:id should return status code 404 when card is not found', async () => {
    const user = await generateAuthenticatedUser();

    const response = await request(app.getHttpServer())
      .get(`/cards/999`)
      .set('Authorization', `Bearer ${user.token}`);

    expect(response.statusCode).toBe(404);
  });

  it('DELETE/cards/:id should return status code 200 when card is successfully deleted', async () => {
    const user = await generateAuthenticatedUser();

    const card = await CardFactory.build(prisma, undefined, user.id);

    const response = await request(app.getHttpServer())
      .delete(`/cards/${card.id}`)
      .set('Authorization', `Bearer ${user.token}`);

    expect(response.statusCode).toBe(200);
  });

  it('DELETE/cards/:id should return status code 404 when card is not found', async () => {
    const user = await generateAuthenticatedUser();

    const response = await request(app.getHttpServer())
      .delete(`/cards/999`)
      .set('Authorization', `Bearer ${user.token}`);

    expect(response.statusCode).toBe(404);
  });

  it('DELETE/cards/:id should return status code 403 when card does not belong to user', async () => {
    const user1 = await generateAuthenticatedUser();
    const user2 = await generateAuthenticatedUser();

    const card = await CardFactory.build(prisma, undefined, user2.id);

    const response = await request(app.getHttpServer())
      .delete(`/cards/${card.id}`)
      .set('Authorization', `Bearer ${user1.token}`);

    expect(response.statusCode).toBe(403);
  });
});
