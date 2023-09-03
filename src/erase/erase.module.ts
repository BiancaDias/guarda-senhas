import { Module } from '@nestjs/common';
import { EraseService } from './erase.service';
import { EraseController } from './erase.controller';
import { PrismaModule, PrismaService } from 'nestjs-prisma';
import { UsersModule } from '../users/users.module';
import { EraseRepositoy } from './erase.repository';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [EraseController],
  providers: [EraseService, PrismaService, EraseRepositoy],
  exports: [EraseService]
})
export class EraseModule {}
