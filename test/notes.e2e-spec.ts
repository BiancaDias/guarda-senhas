import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { E2EUtils } from './utils/e2e-utils';

describe('Notes (e2e)', () => {
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
    app.useGlobalPipes(new ValidationPipe())
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
    await app.init();

    await E2EUtils.cleanDb(prisma);
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  })

  it('GET /notes => should return 200', async() => {

    const signup = await E2EUtils.createUser1(prisma);

    await E2EUtils.createNote(prisma, signup.id);

    const user = E2EUtils.user();
    
    const signin = await request(app.getHttpServer())
    .post('/users/sign-in')
    .send(user)

    const token = signin.body.token;
    return request(app.getHttpServer())
      .get('/notes')
      .set('Authorization', `Bearer ${token}`) 
      .expect(HttpStatus.OK)
  });

  it('GET /notes/id => should return 200', async() => {
    
    const signup = await E2EUtils.createUser1(prisma);

    const note = await E2EUtils.createNote(prisma, signup.id);

    const user = E2EUtils.user();
    
    const signin = await request(app.getHttpServer())
    .post('/users/sign-in')
    .send(user)

    const token = signin.body.token;
    return request(app.getHttpServer())
      .get(`/notes/${note.id}`)
      .set('Authorization', `Bearer ${token}`) 
      .expect(HttpStatus.OK)
  });

  it('GET /notes/id => should return 403', async() => {
    //usuario 1
    await E2EUtils.createUser1(prisma);
    //usuario 2
    const signup2 = await E2EUtils.createUser2(prisma);

    const note = await E2EUtils.createNote(prisma, signup2.id);

    const user = E2EUtils.user();
    
    const signin = await request(app.getHttpServer())
    .post('/users/sign-in')
    .send(user)

    const token = signin.body.token;
    return request(app.getHttpServer())
      .get(`/notes/${note.id}`)
      .set('Authorization', `Bearer ${token}`) 
      .expect(HttpStatus.FORBIDDEN)
  });

  it('GET /notes/id => should return 404', async() => {
    
    await E2EUtils.createUser1(prisma);

    const user = E2EUtils.user();
    
    const signin = await request(app.getHttpServer())
    .post('/users/sign-in')
    .send(user)

    const token = signin.body.token;
    return request(app.getHttpServer())
      .get(`/notes/${5000}`)
      .set('Authorization', `Bearer ${token}`) 
      .expect(HttpStatus.NOT_FOUND)
  });

  it('POST /notes => should return 201', async() => {

    await E2EUtils.createUser1(prisma);

    const user = E2EUtils.user();
    
    const signin = await request(app.getHttpServer())
    .post('/users/sign-in')
    .send(user)

    const note = E2EUtils.note();

    const token = signin.body.token;
    return request(app.getHttpServer())
      .post('/notes')
      .send(note)
      .set('Authorization', `Bearer ${token}`) 
      .expect(HttpStatus.CREATED)
  });

  it('POST /notes => should return 409', async() => {
    
    const signup = await E2EUtils.createUser1(prisma);

    await E2EUtils.createNote(prisma, signup.id);

    const user = E2EUtils.user();

    const note = E2EUtils.note();
    
    const signin = await request(app.getHttpServer())
    .post('/users/sign-in')
    .send(user)

    const token = signin.body.token;
    return request(app.getHttpServer())
      .post('/notes')
      .send(note)
      .set('Authorization', `Bearer ${token}`) 
      .expect(HttpStatus.CONFLICT)
  });

  it('POST /notes should return 400', async() => {
    
    await E2EUtils.createUser1(prisma);

    const user = E2EUtils.user();
    
    const signin = await request(app.getHttpServer())
    .post('/users/sign-in')
    .send(user)

    const note = { noteTitle: "Lembrete urgente"}

    const token = signin.body.token;
    return request(app.getHttpServer())
      .post('/notes')
      .send(note)
      .set('Authorization', `Bearer ${token}`) 
      .expect(HttpStatus.BAD_REQUEST)
  });

  it('DELETE /notes/id => should return 200', async() => {

    const signup = await E2EUtils.createUser1(prisma);

    const note = await E2EUtils.createNote(prisma, signup.id)

    const user = E2EUtils.user();
    
    const signin = await request(app.getHttpServer())
    .post('/users/sign-in')
    .send(user)

    const token = signin.body.token;
    return request(app.getHttpServer())
      .delete(`/notes/${note.id}`)
      .set('Authorization', `Bearer ${token}`) 
      .expect(HttpStatus.OK)
  });

  it('DELETE /notes/id => should return 403', async() => {
    //usuario 1
    await E2EUtils.createUser1(prisma)

    //usuario 2    
    const signup2 = await E2EUtils.createUser2(prisma)

    const notes = await E2EUtils.createNote(prisma, signup2.id)

    const user = E2EUtils.user();
    
    const signin = await request(app.getHttpServer())
    .post('/users/sign-in')
    .send(user)

    const token = signin.body.token;
    return request(app.getHttpServer())
      .delete(`/notes/${notes.id}`)
      .set('Authorization', `Bearer ${token}`) 
      .expect(HttpStatus.FORBIDDEN)
  });
});