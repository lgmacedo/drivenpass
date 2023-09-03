import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { UserFactory } from './factories/user.factory';
import { NoteFactory } from './factories/note.factory';

describe('NotesController (e2e)', () => {
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

  it('POST/notes should return status code 201 when given data is alright', async () => {
    const user = await generateAuthenticatedUser();

    const response = await request(app.getHttpServer())
      .post('/notes')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        title: 'Note title',
        note: 'Note content',
      });

    expect(response.statusCode).toBe(201);
  });

  it('POST/notes should return status code 400 when data is missing', async () => {
    const user = await generateAuthenticatedUser();

    const response = await request(app.getHttpServer())
      .post('/notes')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        title: 'Note title',
      });

    expect(response.statusCode).toBe(400);
  });

  it('POST/notes should return status code 409 when note already exists', async () => {
    const user = await generateAuthenticatedUser();

    const note = await NoteFactory.build(prisma, undefined, user.id);

    const response = await request(app.getHttpServer())
      .post('/notes')
      .set('Authorization', `Bearer ${user.token}`)
      .send({
        title: note.title,
        note: note.note,
      });

    expect(response.statusCode).toBe(409);
  });

  it('GET/notes should return status code 200 and an array of notes', async () => {
    const user = await generateAuthenticatedUser();

    const note = await NoteFactory.build(prisma, undefined, user.id);

    const response = await request(app.getHttpServer())
      .get('/notes')
      .set('Authorization', `Bearer ${user.token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([note]);
  });

  it('GET/notes/:id should return status code 403 when note does not belong to user', async () => {
    const user1 = await generateAuthenticatedUser();
    const user2 = await generateAuthenticatedUser();

    const note = await NoteFactory.build(prisma, undefined, user2.id);

    const response = await request(app.getHttpServer())
      .get(`/notes/${note.id}`)
      .set('Authorization', `Bearer ${user1.token}`);

    expect(response.statusCode).toBe(403);
  });

  it('GET/notes/:id should return status code 404 when note is not found', async () => {
    const user = await generateAuthenticatedUser();

    const response = await request(app.getHttpServer())
      .get(`/notes/999`)
      .set('Authorization', `Bearer ${user.token}`);

    expect(response.statusCode).toBe(404);
  });

  it('DELETE/notes/:id should return status code 200 when note is successfully deleted', async () => {
    const user = await generateAuthenticatedUser();

    const note = await NoteFactory.build(prisma, undefined, user.id);

    const response = await request(app.getHttpServer())
      .delete(`/notes/${note.id}`)
      .set('Authorization', `Bearer ${user.token}`);

    expect(response.statusCode).toBe(200);
  });

  it('DELETE/notes/:id should return status code 404 when note is not found', async () => {
    const user = await generateAuthenticatedUser();

    const response = await request(app.getHttpServer())
      .delete(`/notes/999`)
      .set('Authorization', `Bearer ${user.token}`);

    expect(response.statusCode).toBe(404);
  });

  it('DELETE/notes/:id should return status code 403 when note does not belong to user', async () => {
    const user1 = await generateAuthenticatedUser();
    const user2 = await generateAuthenticatedUser();

    const note = await NoteFactory.build(prisma, undefined, user2.id);

    const response = await request(app.getHttpServer())
      .delete(`/notes/${note.id}`)
      .set('Authorization', `Bearer ${user1.token}`);

    expect(response.statusCode).toBe(403);
  });
});
