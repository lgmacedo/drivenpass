import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { UserFactory } from './factories/user.factory';
import { CredentialFactory } from './factories/credential.factory';

describe('CredentialsController (e2e)', () => {
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

  it('POST/credentials should return status code 201 when given data is alright', async () => {
    const user = await generateAuthenticatedUser();

    const response = await request(app.getHttpServer())
      .post('/credentials')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        title: 'My facebook',
        url: 'www.facebook.com',
        username: 'JohnDoe',
        password: 'myfacebookpassword',
      });

    expect(response.statusCode).toBe(201);
  });

  it('POST/credentials should return status code 400 when data is missing', async () => {
    const user = await generateAuthenticatedUser();

    const response = await request(app.getHttpServer())
      .post('/credentials')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        title: 'My facebook',
        url: 'www.facebook.com',
        username: 'JohnDoe',
        password: '',
      });

    expect(response.statusCode).toBe(400);
  });

  it('POST/credentials should return status code 409 when credential already exists', async () => {
    const user = await generateAuthenticatedUser();

    await CredentialFactory.build(prisma, 'My facebook', user.id);

    const response = await request(app.getHttpServer())
      .post('/credentials')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        title: 'My facebook',
        url: 'www.facebook.com',
        username: 'JohnDoe',
        password: 'strongPassw0rd!',
      });

    expect(response.statusCode).toBe(409);
  });

  it('GET/credentials should return status code 200 and an array of credentials', async () => {
    const user = await generateAuthenticatedUser();

    const credential = await CredentialFactory.build(
      prisma,
      'My facebook',
      user.id,
    );

    const response = await request(app.getHttpServer())
      .get('/credentials')
      .set('Authorization', `Bearer ${user.token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      { ...credential, password: expect.any(String) },
    ]);
  });

  it('GET/credentials/:id should return status code 200 and a credential', async () => {
    const user = await generateAuthenticatedUser();

    const credential = await CredentialFactory.build(
      prisma,
      'My facebook',
      user.id,
    );

    const response = await request(app.getHttpServer())
      .get(`/credentials/${credential.id}`)
      .set('Authorization', `Bearer ${user.token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      ...credential,
      password: expect.any(String),
    });
  });

  it('GET/credentials/:id should return status code 403 when credential does not belong to user', async () => {
    const user1 = await generateAuthenticatedUser();
    const user2 = await generateAuthenticatedUser();

    const credential = await CredentialFactory.build(
      prisma,
      'My facebook',
      user1.id,
    );

    const response = await request(app.getHttpServer())
      .get(`/credentials/${credential.id}`)
      .set('Authorization', `Bearer ${user2.token}`);

    expect(response.statusCode).toBe(403);
  });

  it('GET/credentials/:id should return status code 404 when credential is not found', async () => {
    const user = await generateAuthenticatedUser();

    const response = await request(app.getHttpServer())
      .get(`/credentials/999`)
      .set('Authorization', `Bearer ${user.token}`);

    expect(response.statusCode).toBe(404);
  });

  it('DELETE/credentials/:id should return status code 200 when credential successfully deleted', async () => {
    const user = await generateAuthenticatedUser();

    const credential = await CredentialFactory.build(
      prisma,
      'My facebook',
      user.id,
    );

    const response = await request(app.getHttpServer())
      .delete(`/credentials/${credential.id}`)
      .set('Authorization', `Bearer ${user.token}`);

    expect(response.statusCode).toBe(200);
  });

  it('DELETE/credentials/:id should return status code 404 when credential is not found', async () => {
    const user = await generateAuthenticatedUser();

    const response = await request(app.getHttpServer())
      .delete(`/credentials/999`)
      .set('Authorization', `Bearer ${user.token}`);

    expect(response.statusCode).toBe(404);
  });

  it('DELETE/credentials/:id should return status code 403 when credential doest not belong to user', async () => {
    const user1 = await generateAuthenticatedUser();
    const user2 = await generateAuthenticatedUser();

    const credential = await CredentialFactory.build(
      prisma,
      'My facebook',
      user2.id,
    );

    const response = await request(app.getHttpServer())
      .delete(`/credentials/${credential.id}`)
      .set('Authorization', `Bearer ${user1.token}`);

    expect(response.statusCode).toBe(403);
  });
});
