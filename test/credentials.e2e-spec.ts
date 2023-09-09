import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { E2EUtils } from './utils/e2e-utils';

describe('Credentials (e2e)', () => {
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

  it('GET /credentials => should return 200', async() => {

    const signup = await E2EUtils.createUser1(prisma);

    await E2EUtils.createCredential(prisma, signup.id);

    const user = E2EUtils.user();
    
    const signin = await request(app.getHttpServer())
    .post('/users/sign-in')
    .send(user)

    const token = signin.body.token;
    return request(app.getHttpServer())
      .get('/credentials')
      .set('Authorization', `Bearer ${token}`) 
      .expect(HttpStatus.OK)
  });

  it('POST /credentials => should return 201', async() => {
    
    await E2EUtils.createUser1(prisma)

    const user = E2EUtils.user()
    
    const signin = await request(app.getHttpServer())
    .post('/users/sign-in')
    .send(user)

    const credential = E2EUtils.credential()

    const token = signin.body.token;
    return request(app.getHttpServer())
      .post('/credentials')
      .send(credential)
      .set('Authorization', `Bearer ${token}`) 
      .expect(HttpStatus.CREATED)
  });

  it('POST /credentials => should return 400', async() => {
    
    const signup = await E2EUtils.createUser1(prisma)

    await E2EUtils.createCredential(prisma, signup.id)

    const user = E2EUtils.user()

    const credential = E2EUtils.credential()
    
    const signin = await request(app.getHttpServer())
    .post('/users/sign-in')
    .send(user)

    const token = signin.body.token;
    return request(app.getHttpServer())
      .post('/credentials')
      .send(credential)
      .set('Authorization', `Bearer ${token}`) 
      .expect(HttpStatus.CONFLICT)
  });

  it('POST /credentials => should return 400', async() => {

    await E2EUtils.createUser1(prisma)

    const user = E2EUtils.user()
    
    const signin = await request(app.getHttpServer())
    .post('/users/sign-in')
    .send(user)

    const badCredential = {
      userName: "bianca@bianca.com",
      password: "Senha@S3gura",
    }
    const token = signin.body.token;
    return request(app.getHttpServer())
      .post('/credentials')
      .send(badCredential)
      .set('Authorization', `Bearer ${token}`) 
      .expect(HttpStatus.BAD_REQUEST)
  });

  it('GET /credentials/id => should return 200', async() => {
    
    const signup = await E2EUtils.createUser1(prisma)

    const credential =await E2EUtils.createCredential(prisma, signup.id)

    const user = E2EUtils.user()
    
    const signin = await request(app.getHttpServer())
    .post('/users/sign-in')
    .send(user)

    const token = signin.body.token;
    return request(app.getHttpServer())
      .get(`/credentials/${credential.id}`)
      .set('Authorization', `Bearer ${token}`) 
      .expect(HttpStatus.OK)
  });

  it('GET /credentials/id => should return 403', async() => {
    //usuario 1
    await E2EUtils.createUser1(prisma);
    //usuario 2
    const signup2 = await E2EUtils.createUser2(prisma);

    const credential = await E2EUtils.createCredential(prisma, signup2.id)

    const user = E2EUtils.user()
    
    const signin = await request(app.getHttpServer())
    .post('/users/sign-in')
    .send(user)

    const token = signin.body.token;
    return request(app.getHttpServer())
      .get(`/credentials/${credential.id}`)
      .set('Authorization', `Bearer ${token}`) 
      .expect(HttpStatus.FORBIDDEN)
  });

  it('GET /credentials/id => should return 404', async() => {
    
    await E2EUtils.createUser1(prisma);

    const user = E2EUtils.user()
    
    const signin = await request(app.getHttpServer())
    .post('/users/sign-in')
    .send(user)

    const token = signin.body.token;
    return request(app.getHttpServer())
      .get(`/credentials/${5000}`)
      .set('Authorization', `Bearer ${token}`) 
      .expect(HttpStatus.NOT_FOUND)
  });

  it('DELETE /credentials/id => should return 200', async() => {
    
    const signup = await E2EUtils.createUser1(prisma);

    const credential = await E2EUtils.createCredential(prisma, signup.id)

    const user = E2EUtils.user()
    
    const signin = await request(app.getHttpServer())
    .post('/users/sign-in')
    .send(user)

    const token = signin.body.token;
    return request(app.getHttpServer())
      .delete(`/credentials/${credential.id}`)
      .set('Authorization', `Bearer ${token}`) 
      .expect(HttpStatus.OK)
  });

  it('DELETE /credentials/id => should return 403', async() => {
    //usuario 1
    await E2EUtils.createUser1(prisma);
    //usuario 2
    const signup2 = await E2EUtils.createUser2(prisma);

    const credential = await E2EUtils.createCredential(prisma, signup2.id)

    const user = E2EUtils.user()
    
    const signin = await request(app.getHttpServer())
    .post('/users/sign-in')
    .send(user)

    const token = signin.body.token;
    return request(app.getHttpServer())
      .delete(`/credentials/${credential.id}`)
      .set('Authorization', `Bearer ${token}`) 
      .expect(HttpStatus.FORBIDDEN)
  });
});
