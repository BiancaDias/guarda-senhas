import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateCardDto } from './dto/create-card.dto';


@Injectable()
export class CardsRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(createCardDto: CreateCardDto, userId: number) {
    return await this.prisma.credCards.create({
      data: {
        cardTitle: createCardDto.cardTitle,
        cardNumber: createCardDto.cardNumber,
        cardName: createCardDto.cardName,
        secutityCode: createCardDto.secutityCode,
        expirationDate: createCardDto.expirationDate,
        password: createCardDto.password,
        virtual: createCardDto.virtual,
        isCredit: createCardDto.isCredit,
        isDebit: createCardDto.isDebit,
        userId
      }
    })
  }

  async findAll(userId: number) {
    return await this.prisma.credCards.findMany({
      where: {userId}
    })
  }

  async findOne(id: number) {
    return await this.prisma.credCards.findUnique({
      where:{id}
    })
  }

  async remove(id: number) {
    return await this.prisma.credCards.delete({
      where: {id}
    })
  }
}