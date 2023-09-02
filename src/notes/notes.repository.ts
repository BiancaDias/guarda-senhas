import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class NotesRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(createNoteDto: CreateNoteDto, userId: number) {
    return await this.prisma.notes.create({
      data: {
        note: createNoteDto.note,
        noteTitle: createNoteDto.noteTitle,
        userId
      }
    })
  }

  async findAll(userId: number) {
    return await this.prisma.credentials.findMany({
      where: {userId}
    })
  }

  async findOne(id: number) {
    return await this.prisma.credentials.findUnique({
      where:{id}
    })
  }

  async remove(id: number) {
    return await this.prisma.credentials.delete({
      where: {id}
    })
  }
}