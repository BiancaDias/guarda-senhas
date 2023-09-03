import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { PrismaModule, PrismaService } from 'nestjs-prisma';
import { UsersModule } from '../users/users.module';
import { CardsRepository } from './cards.repository';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [CardsController],
  providers: [CardsService, PrismaService, CardsRepository],
  exports: [CardsService]
})
export class CardsModule {}
