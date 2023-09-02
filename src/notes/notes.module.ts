import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { PrismaModule, PrismaService } from 'nestjs-prisma';
import { UsersModule } from '../users/users.module';
import { NotesRepository } from './notes.repository';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [NotesController],
  providers: [NotesService, PrismaService, NotesRepository],
  exports: [NotesService]
})
export class NotesModule {}
