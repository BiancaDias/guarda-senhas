import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Users } from '@prisma/client';
import { CreateCardDto } from './dto/create-card.dto';
import { CardsRepository } from './cards.repository';
import Cryptr from 'cryptr';

@Injectable()
export class CardsService {
  private cryptr: Cryptr
  constructor(private readonly repository: CardsRepository){
    const Cryptr = require('cryptr');
    this.cryptr = new Cryptr(process.env.SECRET_CRYPTR);
  }
  async create(createCardDto: CreateCardDto, user: Users) {
    createCardDto.secutityCode = this.cryptr.encrypt(createCardDto.secutityCode)
    createCardDto.password = this.cryptr.encrypt(createCardDto.password)
    return await this.repository.create(createCardDto, user.id);
  }

  async findAll(user: Users) {
    const cards = await this.repository.findAll(user.id);
    const cardsReturn = cards.map((card) => ({
      ...card,
      secutityCode: this.cryptr.decrypt(card.secutityCode),
      password: this.cryptr.decrypt(card.password)
    }))

    return cardsReturn;
  }

  async findOne(id: number, user: Users) {

    const card = await this.repository.findOne(id)
    if(!card) throw new NotFoundException("Card not found!")
    if(card.userId !== user.id) throw new ForbiddenException("Forbidden");
    
    card.password = this.cryptr.decrypt(card.password);
    card.secutityCode = this.cryptr.decrypt(card.secutityCode);
    return card;
  }

  async remove(id: number, user: Users) {
    await this.findOne(id, user)
    return await this.repository.remove(id);
  }
}
