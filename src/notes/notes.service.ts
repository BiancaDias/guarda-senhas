import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Users } from '@prisma/client';
import { NotesRepository } from './notes.repository';
import { CreateNoteDto } from './dto/create-note.dto';


@Injectable()
export class NotesService {
 
  constructor(private readonly repository: NotesRepository){}

  async create(createNoteDto: CreateNoteDto, user: Users) {
  
    return await this.repository.create(createNoteDto, user.id);
  }

  async findAll(user: Users) {
    return await this.repository.findAll(user.id);
  }

  async findOne(id: number, user: Users) {

    const note = await this.repository.findOne(id)
    if(!note) throw new NotFoundException("Note not found!")
    if(note.userId !== user.id) throw new ForbiddenException("Forbidden");
    
    return note;
  }

  async remove(id: number, user: Users) {
    await this.findOne(id, user)
    return await this.repository.remove(id);
  }
}