import { PrismaService } from  "../../src/prisma/prisma.service";
import { faker } from '@faker-js/faker';
import Cryptr from 'cryptr';

export class CardFactory {
  private cardTitle: string;
  private cardNumber: string;
  private cardName: string;
  private secutityCode: string;
  private expirationDate: string;
  private password: string;
  private virtual: boolean;
  private isCredit: boolean;
  private isDebit: boolean;
  private userId: number;
  private cryptr: Cryptr;

  constructor(private readonly prisma: PrismaService, userId: number) {
    const Cryptr = require('cryptr');
    this.cryptr = new Cryptr(process.env.SECRET_CRYPTR);

    this.cardTitle = faker.internet.userName(),
    this.cardNumber = faker.finance.creditCardNumber();
    this.cardName = faker.person.firstName();
    this.secutityCode = (faker.number.int({ min: 100, max: 999 })).toString();
    this.expirationDate = faker.date.future().toISOString().split('T')[0];
    this.password = (faker.number.int({ min: 1000, max: 9999 })).toString();
    this.virtual = faker.datatype.boolean();
    this.isCredit = faker.datatype.boolean();
    this.isDebit = faker.datatype.boolean();
    this.userId = userId;
  }

  build() {
    return {
      cardTitle: this.cardTitle,
      cardNumber: this.cardNumber,
      cardName: this.cardName,
      secutityCode: this.cryptr.encrypt(this.secutityCode),
      expirationDate: this.expirationDate,
      password: this.cryptr.encrypt(this.password),
      virtual: this.virtual,
      isCredit: this.isCredit,
      isDebit: this.isDebit,
      userId: this.userId
    }
  }
  async persist() {
    const data = this.build();
    return await this.prisma.credCards.create({data})
  }
}