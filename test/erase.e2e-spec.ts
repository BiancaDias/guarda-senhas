import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
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


  it('DELETE /erase => should return 403', async() => {

    await E2EUtils.createUser1(prisma)

    const user = E2EUtils.user();
    
    const password = {password: "Senha@S3gura."}

    const signin = await request(app.getHttpServer())
    .post('/users/sign-in')
    .send(user)

    const token = signin.body.token;
    return request(app.getHttpServer())
      .delete(`/erase`)
      .set('Authorization', `Bearer ${token}`) 
      .send(password)
      .expect(HttpStatus.UNAUTHORIZED)
  });

  it('DELETE /erase => should return 200', async() => {

    await E2EUtils.createUser1(prisma)

    const user = E2EUtils.user();
    
    const password = {
      password: "Senha@S3gura"
    }
    const signin = await request(app.getHttpServer())
    .post('/users/sign-in')
    .send(user)

    const token = signin.body.token;
    return request(app.getHttpServer())
      .delete(`/erase`)
      .set('Authorization', `Bearer ${token}`) 
      .send(password)
      .expect(HttpStatus.OK)
  });
});