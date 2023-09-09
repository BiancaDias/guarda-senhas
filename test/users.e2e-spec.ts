import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { E2EUtils } from './utils/e2e-utils';
import { UserFactory } from './factories/users.factory';

describe('Users (e2e)', () => {
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
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
    await app.init();

    await E2EUtils.cleanDb(prisma);
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  })

  it('POST /sign-in => should return 201', () => {

    const user = E2EUtils.user()

    return request(app.getHttpServer())
      .post('/users/sign-up')
      .send(user)
      .expect(HttpStatus.CREATED)
  });

  it('POST /sign-up => should return 409', async () => {

    await E2EUtils.createUser1(prisma);

    const user = E2EUtils.user()

    return request(app.getHttpServer())
      .post('/users/sign-up')
      .send(user)
      .expect(HttpStatus.CONFLICT)
  });

  it('POST /sign-in => should return 400', () => {

    const user = E2EUtils.userBadPassword()

    return request(app.getHttpServer())
      .post('/users/sign-up')
      .send(user)
      .expect(HttpStatus.BAD_REQUEST)
  });
  it('POST /sign-in => should return 409', async () => {

    const user = E2EUtils.user()

    return request(app.getHttpServer())
      .post('/users/sign-in')
      .send(user)
      .expect(HttpStatus.UNAUTHORIZED)
  });

  it('POST /sign-in => should return 200', async () => {
    
    await E2EUtils.createUser1(prisma)

    const user = E2EUtils.user()
    
    return await request(app.getHttpServer())
      .post('/users/sign-in')
      .send(user)
      .expect(HttpStatus.OK)
  });

});
