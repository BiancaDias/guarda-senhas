import { PrismaService } from "../../src/prisma/prisma.service";
import { faker } from '@faker-js/faker';
import { UserFactory } from "../factories/users.factory";

export class E2EUtils {

  static async cleanDb(prisma: PrismaService){
    await prisma.credCards.deleteMany();
    await prisma.notes.deleteMany();
    await prisma.credentials.deleteMany();
    await prisma.users.deleteMany();
  }

  static createCredCard(cardTitle: string){
    return{
      cardTitle: cardTitle,
      cardNumber: faker.finance.creditCardNumber(),
      cardName: faker.person.firstName(), 
      secutityCode: (faker.number.int({ min: 100, max: 999 })).toString(),
      expirationDate: faker.date.future().toISOString().split('T')[0],
      password: (faker.number.int({ min: 1000, max: 9999 })).toString(),
      virtual: faker.datatype.boolean(),
      isCredit: faker.datatype.boolean(),
      isDebit: faker.datatype.boolean()
    }
  }

  static user(){
    return {
      email: "bianca@bianca.com",
      password: "Senha@S3gura"
    }
  }
  static user2(){
    return {
      email: "bianca1@bianca.com",
      password: "Senha1@S3gura"
    }
  }

  static userBadPassword(){
    return {
      email: "bianca@bianca.com",
      password: "123456"
    }
  }
  static async createUser1(prisma: PrismaService){
    const userFactory = new UserFactory(prisma)
    userFactory.setEmail("bianca@bianca.com");
    userFactory.setPassword("Senha@S3gura");
    return await userFactory.persist();
  }

  static async createUser2(prisma: PrismaService){
    const userFactory = new UserFactory(prisma)
    userFactory.setEmail("bianca1@bianca.com");
    userFactory.setPassword("Senha1@S3gura");
    return await userFactory.persist();
  }
}