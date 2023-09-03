import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class EraseRepositoy {
  constructor(private readonly prisma: PrismaService) { }

  async remove(userId: number) {
    await this.prisma.credentials.deleteMany({
      where: {userId}
    })
    await this.prisma.notes.deleteMany({
      where: {userId}
    })
    await this.prisma.credCards.deleteMany({
      where: {userId}
    })
    await this.prisma.users.deleteMany({
      where: {id: userId}
    })
  }
}
