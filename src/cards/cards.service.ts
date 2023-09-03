import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Users } from '@prisma/client';
import { CreateCardDto } from './dto/create-card.dto';
import { CardsRepository } from './cards.repository';

@Injectable()
export class CardsService {
  constructor(private readonly repository: CardsRepository){}
  async create(createCardDto: CreateCardDto, user: Users) {
  
    return await this.repository.create(createCardDto, user.id);
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
