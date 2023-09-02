import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { E2EUtils } from './utils/e2e-utils';
import { UserFactory } from './factories/users.factory';
import { CredentialFactory } from './factories/credentials.factory';
import Cryptr from 'cryptr';

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
    const userFactory = await new UserFactory(prisma)
    userFactory.setEmail("bianca@bianca.com");
    userFactory.setPassword("Senha@S3gura");
    const signup = await userFactory.persist();

    // const cryptr = new Cryptr("MyKey")
    // const hash = cryptr.encrypt("Senha@S3gura")
    const credentialFactory = await new CredentialFactory(prisma)
    credentialFactory.setCredentialTitle("Facebook");
    credentialFactory.setPassword("Senha");
    credentialFactory.setUsername("MyFacebook")
    credentialFactory.setUrl("facebook.com")
    credentialFactory.setUserId(signup.id)
    await credentialFactory.persist();

    const user = {
      email: "bianca@bianca.com",
      password: "Senha@S3gura"
    }
    
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
    const userFactory = await new UserFactory(prisma)
    userFactory.setEmail("bianca@bianca.com");
    userFactory.setPassword("Senha@S3gura");
    await userFactory.persist();

    // const cryptr = new Cryptr("MyKey")
    // const hash = cryptr.encrypt("Senha@S3gura")
    

    const user = {
      email: "bianca@bianca.com",
      password: "Senha@S3gura"
    }
    
    const signin = await request(app.getHttpServer())
    .post('/users/sign-in')
    .send(user)

    const credential = {
      userName: "bianca@bianca.com",
      password: "Senha@S3gura",
      url: "facebook.com",
      credentialTitle: 'facebook'
    }
    const token = signin.body.token;
    return request(app.getHttpServer())
      .post('/credentials')
      .send(credential)
      .set('Authorization', `Bearer ${token}`) 
      .expect(HttpStatus.CREATED)
  });

  it('POST /credentials => should return 400', async() => {
    const userFactory = await new UserFactory(prisma)
    userFactory.setEmail("bianca@bianca.com");
    userFactory.setPassword("Senha@S3gura");
    const signup = await userFactory.persist();

    // const cryptr = new Cryptr("MyKey")
    // const hash = cryptr.encrypt("Senha@S3gura")
    const credentialFactory = await new CredentialFactory(prisma)
    credentialFactory.setCredentialTitle("facebook");
    credentialFactory.setPassword("Senha");
    credentialFactory.setUsername("MyFacebook")
    credentialFactory.setUrl("facebook.com")
    credentialFactory.setUserId(signup.id)
    await credentialFactory.persist();

    const user = {
      email: "bianca@bianca.com",
      password: "Senha@S3gura"
    }

    const credential = {
      userName: "bianca@bianca.com",
      password: "Senha@S3gura",
      url: "facebook.com",
      credentialTitle: 'facebook'
    }
    
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
    const userFactory = await new UserFactory(prisma)
    userFactory.setEmail("bianca@bianca.com");
    userFactory.setPassword("Senha@S3gura");
    await userFactory.persist();

    // const cryptr = new Cryptr("MyKey")
    // const hash = cryptr.encrypt("Senha@S3gura")
    

    const user = {
      email: "bianca@bianca.com",
      password: "Senha@S3gura"
    }
    
    const signin = await request(app.getHttpServer())
    .post('/users/sign-in')
    .send(user)

    const credential = {
      userName: "bianca@bianca.com",
      password: "Senha@S3gura",
    }
    const token = signin.body.token;
    return request(app.getHttpServer())
      .post('/credentials')
      .send(credential)
      .set('Authorization', `Bearer ${token}`) 
      .expect(HttpStatus.BAD_REQUEST)
  });

  it('GET /credentials/id => should return 200', async() => {
    const userFactory = await new UserFactory(prisma)
    userFactory.setEmail("bianca@bianca.com");
    userFactory.setPassword("Senha@S3gura");
    const signup = await userFactory.persist();

    // const cryptr = new Cryptr("MyKey")
    // const hash = cryptr.encrypt("Senha@S3gura")
    const credentialFactory = await new CredentialFactory(prisma)
    credentialFactory.setCredentialTitle("Facebook");
    credentialFactory.setPassword("Senha");
    credentialFactory.setUsername("MyFacebook")
    credentialFactory.setUrl("facebook.com")
    credentialFactory.setUserId(signup.id)
    const credential = await credentialFactory.persist();

    const user = {
      email: "bianca@bianca.com",
      password: "Senha@S3gura"
    }
    
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
    const userFactory = await new UserFactory(prisma)
    userFactory.setEmail("bianca@bianca.com");
    userFactory.setPassword("Senha@S3gura");
    const signup = await userFactory.persist();

    //usuario 2
    const userFactory2 = await new UserFactory(prisma)
    userFactory2.setEmail("bianca1@bianca.com");
    userFactory2.setPassword("Senha@S3gura");
    const signup2 = await userFactory2.persist();

    // const cryptr = new Cryptr("MyKey")
    // const hash = cryptr.encrypt("Senha@S3gura")
    const credentialFactory = await new CredentialFactory(prisma)
    credentialFactory.setCredentialTitle("Facebook");
    credentialFactory.setPassword("Senha");
    credentialFactory.setUsername("MyFacebook")
    credentialFactory.setUrl("facebook.com")
    credentialFactory.setUserId(signup2.id)
    const credential = await credentialFactory.persist();

    const user = {
      email: "bianca@bianca.com",
      password: "Senha@S3gura"
    }
    
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
    const userFactory = await new UserFactory(prisma)
    userFactory.setEmail("bianca@bianca.com");
    userFactory.setPassword("Senha@S3gura");
    await userFactory.persist();

    // const cryptr = new Cryptr("MyKey")
    // const hash = cryptr.encrypt("Senha@S3gura")
    

    const user = {
      email: "bianca@bianca.com",
      password: "Senha@S3gura"
    }
    
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
    const userFactory = await new UserFactory(prisma)
    userFactory.setEmail("bianca@bianca.com");
    userFactory.setPassword("Senha@S3gura");
    const signup = await userFactory.persist();

    // const cryptr = new Cryptr("MyKey")
    // const hash = cryptr.encrypt("Senha@S3gura")
    const credentialFactory = await new CredentialFactory(prisma)
    credentialFactory.setCredentialTitle("Facebook");
    credentialFactory.setPassword("Senha");
    credentialFactory.setUsername("MyFacebook")
    credentialFactory.setUrl("facebook.com")
    credentialFactory.setUserId(signup.id)
    const credential = await credentialFactory.persist();

    const user = {
      email: "bianca@bianca.com",
      password: "Senha@S3gura"
    }
    
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
    const userFactory = await new UserFactory(prisma)
    userFactory.setEmail("bianca@bianca.com");
    userFactory.setPassword("Senha@S3gura");
    const signup = await userFactory.persist();

    //usuario 2
    const userFactory2 = await new UserFactory(prisma)
    userFactory2.setEmail("bianca1@bianca.com");
    userFactory2.setPassword("Senha@S3gura");
    const signup2 = await userFactory2.persist();

    // const cryptr = new Cryptr("MyKey")
    // const hash = cryptr.encrypt("Senha@S3gura")
    const credentialFactory = await new CredentialFactory(prisma)
    credentialFactory.setCredentialTitle("Facebook");
    credentialFactory.setPassword("Senha");
    credentialFactory.setUsername("MyFacebook")
    credentialFactory.setUrl("facebook.com")
    credentialFactory.setUserId(signup2.id)
    const credential = await credentialFactory.persist();

    const user = {
      email: "bianca@bianca.com",
      password: "Senha@S3gura"
    }
    
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
