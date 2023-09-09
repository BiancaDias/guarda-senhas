import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { E2EUtils } from './utils/e2e-utils';
import { UserFactory } from './factories/users.factory';
import { CardFactory } from './factories/cards.factory';

describe('Cards (e2e)', () => {
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

  it('GET /cards => should return 200', async() => {
    
    const signup = await E2EUtils.createUser1(prisma)

    const cardFactory = new CardFactory(prisma, signup.id)
    await cardFactory.persist();

    const user = E2EUtils.user();
    
    const signin = await request(app.getHttpServer())
    .post('/users/sign-in')
    .send(user)

    const token = signin.body.token;
    return request(app.getHttpServer())
      .get('/cards')
      .set('Authorization', `Bearer ${token}`) 
      .expect(HttpStatus.OK)
  });

  it('POST /cards => should return 201', async() => {
    
    await E2EUtils.createUser1(prisma)

    const user = E2EUtils.user();
    
    const signin = await request(app.getHttpServer())
    .post('/users/sign-in')
    .send(user)

    const card = E2EUtils.createCredCard("MeuCard");

    const token = signin.body.token;
    const postCard =  await request(app.getHttpServer())
      .post('/cards')
      .send(card)
      .set('Authorization', `Bearer ${token}`) 
      
      expect(postCard.status).toBe(HttpStatus.CREATED)
  });

  it('POST /cards => should return 409', async() => {
    
    const signup = await E2EUtils.createUser1(prisma)

    const cardFactory = new CardFactory(prisma, signup.id)
    const cardTitle = await cardFactory.persist();

    const user = E2EUtils.user();

    const card = E2EUtils.createCredCard(cardTitle.cardTitle);
    
    const signin = await request(app.getHttpServer())
    .post('/users/sign-in')
    .send(user)

    const token = signin.body.token;
    return request(app.getHttpServer())
      .post('/cards')
      .send(card)
      .set('Authorization', `Bearer ${token}`) 
      .expect(HttpStatus.CONFLICT)
  });

  it('POST /cards => should return 400', async() => {
    
    await E2EUtils.createUser1(prisma)

    const user = E2EUtils.user();
    
    const signin = await request(app.getHttpServer())
    .post('/users/sign-in')
    .send(user)

    const card = {}
    const token = signin.body.token;
    return request(app.getHttpServer())
      .post('/cards')
      .send(card)
      .set('Authorization', `Bearer ${token}`) 
      .expect(HttpStatus.BAD_REQUEST)
  });

  it('GET /cards/id => should return 200', async() => {
  
    const signup = await E2EUtils.createUser1(prisma)

    const user = E2EUtils.user();

    const cardFactory = new CardFactory(prisma, signup.id)
    const card = await cardFactory.persist();
    
    const signin = await request(app.getHttpServer())
    .post('/users/sign-in')
    .send(user)

    const token = signin.body.token;
    return request(app.getHttpServer())
      .get(`/cards/${card.id}`)
      .set('Authorization', `Bearer ${token}`) 
      .expect(HttpStatus.OK)
  });

  it('GET /cards/id => should return 403', async() => {
   //usuario 1
  await E2EUtils.createUser1(prisma);
   //usuario 2
  const signup2 = await E2EUtils.createUser2(prisma);

    const cardFactory = new CardFactory(prisma, signup2.id)
    const card = await cardFactory.persist();

    const user = E2EUtils.user();
    
    const signin = await request(app.getHttpServer())
    .post('/users/sign-in')
    .send(user)

    const token = signin.body.token;
    return request(app.getHttpServer())
      .get(`/cards/${card.id}`)
      .set('Authorization', `Bearer ${token}`) 
      .expect(HttpStatus.FORBIDDEN)
  });

  it('GET /cards/id => should return 404', async() => {
    
    await E2EUtils.createUser1(prisma);

    const user = E2EUtils.user();
    
    const signin = await request(app.getHttpServer())
    .post('/users/sign-in')
    .send(user)

    const token = signin.body.token;
    return request(app.getHttpServer())
      .get(`/cards/${5000}`)
      .set('Authorization', `Bearer ${token}`) 
      .expect(HttpStatus.NOT_FOUND)
  });

  it('DELETE /cards/id => should return 200', async() => {
    
    const signup = await E2EUtils.createUser1(prisma);

    const cardFactory = new CardFactory(prisma, signup.id)
    const card = await cardFactory.persist();

    const user = E2EUtils.user();
    
    const signin = await request(app.getHttpServer())
    .post('/users/sign-in')
    .send(user)

    const token = signin.body.token;
    return request(app.getHttpServer())
      .delete(`/cards/${card.id}`)
      .set('Authorization', `Bearer ${token}`) 
      .expect(HttpStatus.OK)
  });

  it('DELETE /cards/id => should return 403', async() => {
    //usuario 1
    await E2EUtils.createUser1(prisma);
    //usuario 2
    const signup2 = await E2EUtils.createUser2(prisma);

    const cardFactory = new CardFactory(prisma, signup2.id)
    const card = await cardFactory.persist();

    const user = E2EUtils.user();
    
    const signin = await request(app.getHttpServer())
    .post('/users/sign-in')
    .send(user)

    const token = signin.body.token;
    return request(app.getHttpServer())
      .delete(`/cards/${card.id}`)
      .set('Authorization', `Bearer ${token}`) 
      .expect(HttpStatus.FORBIDDEN)
  });
});
