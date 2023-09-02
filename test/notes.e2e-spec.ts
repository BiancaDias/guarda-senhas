import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { E2EUtils } from './utils/e2e-utils';
import { UserFactory } from './factories/users.factory';
import { NotesFactory } from './factories/notes.factory';


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
    const userFactory = await new UserFactory(prisma)
    userFactory.setEmail("bianca@bianca.com");
    userFactory.setPassword("Senha@S3gura");
    const signup = await userFactory.persist();

    const notesFactory = await new NotesFactory(prisma)
    notesFactory.setnoteTitle("Lembrete");
    notesFactory.setNote("Não Esquecer de corrigir os bugs");
    notesFactory.setUserId(signup.id)
    await notesFactory.persist();

    const user = {
      email: "bianca@bianca.com",
      password: "Senha@S3gura"
    }
    
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
    const userFactory = await new UserFactory(prisma)
    userFactory.setEmail("bianca@bianca.com");
    userFactory.setPassword("Senha@S3gura");
    const signup = await userFactory.persist();

    const notesFactory = await new NotesFactory(prisma)
    notesFactory.setnoteTitle("Lembrete");
    notesFactory.setNote("Não Esquecer de corrigir os bugs");
    notesFactory.setUserId(signup.id)
    const note = await notesFactory.persist();

    const user = {
      email: "bianca@bianca.com",
      password: "Senha@S3gura"
    }
    
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
    const userFactory = await new UserFactory(prisma)
    userFactory.setEmail("bianca@bianca.com");
    userFactory.setPassword("Senha@S3gura");
    const signup = await userFactory.persist();

    //usuario 2
    const userFactory2 = await new UserFactory(prisma)
    userFactory2.setEmail("bianca1@bianca.com");
    userFactory2.setPassword("Senha@S3gura");
    const signup2 = await userFactory2.persist();

    const notesFactory = await new NotesFactory(prisma)
    notesFactory.setnoteTitle("Lembrete");
    notesFactory.setNote("Não Esquecer de corrigir os bugs");
    notesFactory.setUserId(signup2.id)
    const note = await notesFactory.persist();

    const user = {
      email: "bianca@bianca.com",
      password: "Senha@S3gura"
    }
    
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
    const userFactory = await new UserFactory(prisma)
    userFactory.setEmail("bianca@bianca.com");
    userFactory.setPassword("Senha@S3gura");
    await userFactory.persist();    

    const user = {
      email: "bianca@bianca.com",
      password: "Senha@S3gura"
    }
    
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
    const userFactory = await new UserFactory(prisma)
    userFactory.setEmail("bianca@bianca.com");
    userFactory.setPassword("Senha@S3gura");
    await userFactory.persist();

    const user = {
      email: "bianca@bianca.com",
      password: "Senha@S3gura"
    }
    
    const signin = await request(app.getHttpServer())
    .post('/users/sign-in')
    .send(user)

    const note = {
      noteTitle: "Lembrete urgente",
      note: "Muitos bugs pra corrigir"
    }
    const token = signin.body.token;
    return request(app.getHttpServer())
      .post('/notes')
      .send(note)
      .set('Authorization', `Bearer ${token}`) 
      .expect(HttpStatus.CREATED)
  });

  it('POST /notes => should return 409', async() => {
    const userFactory = await new UserFactory(prisma)
    userFactory.setEmail("bianca@bianca.com");
    userFactory.setPassword("Senha@S3gura");
    const signup = await userFactory.persist();

    const notesFactory = await new NotesFactory(prisma)
    notesFactory.setnoteTitle("Lembrete");
    notesFactory.setNote("Não Esquecer de corrigir os bugs");
    notesFactory.setUserId(signup.id)
    await notesFactory.persist();

    const user = {
      email: "bianca@bianca.com",
      password: "Senha@S3gura"
    }

    const note = {
      noteTitle: "Lembrete",
      note: "teste"
    }
    
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
    const userFactory = await new UserFactory(prisma)
    userFactory.setEmail("bianca@bianca.com");
    userFactory.setPassword("Senha@S3gura");
    await userFactory.persist();    

    const user = {
      email: "bianca@bianca.com",
      password: "Senha@S3gura"
    }
    
    const signin = await request(app.getHttpServer())
    .post('/users/sign-in')
    .send(user)

    const note = {
      noteTitle: "Lembrete urgente",
      
    }
    const token = signin.body.token;
    return request(app.getHttpServer())
      .post('/notes')
      .send(note)
      .set('Authorization', `Bearer ${token}`) 
      .expect(HttpStatus.BAD_REQUEST)
  });

  it('DELETE /notes/id => should return 200', async() => {
    const userFactory = await new UserFactory(prisma)
    userFactory.setEmail("bianca@bianca.com");
    userFactory.setPassword("Senha@S3gura");
    const signup = await userFactory.persist();

    const notesFactory = await new NotesFactory(prisma)
    notesFactory.setnoteTitle("Lembrete");
    notesFactory.setNote("Não Esquecer de corrigir os bugs");
    notesFactory.setUserId(signup.id)
    const note = await notesFactory.persist();

    const user = {
      email: "bianca@bianca.com",
      password: "Senha@S3gura"
    }
    
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
    const userFactory = await new UserFactory(prisma)
    userFactory.setEmail("bianca@bianca.com");
    userFactory.setPassword("Senha@S3gura");
    const signup = await userFactory.persist();

    //usuario 2
    const userFactory2 = await new UserFactory(prisma)
    userFactory2.setEmail("bianca1@bianca.com");
    userFactory2.setPassword("Senha@S3gura");
    const signup2 = await userFactory2.persist();

    const notesFactory = await new NotesFactory(prisma)
    notesFactory.setnoteTitle("Lembrete");
    notesFactory.setNote("Não Esquecer de corrigir os bugs");
    notesFactory.setUserId(signup2.id)
    const notes = await notesFactory.persist();

    const user = {
      email: "bianca@bianca.com",
      password: "Senha@S3gura"
    }
    
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