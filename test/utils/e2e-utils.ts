import { PrismaService } from "../../src/prisma/prisma.service";
import { faker } from '@faker-js/faker';

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
}