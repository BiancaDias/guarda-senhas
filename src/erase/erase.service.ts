import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EraseDto } from './dto/erase.dto';
import { Users } from '@prisma/client';
import * as bcrypt from "bcrypt";
import { EraseRepositoy } from './erase.repository';

@Injectable()
export class EraseService {
  constructor(private readonly repository: EraseRepositoy){}

  async remove(password: EraseDto, user: Users) {
    const valid = await bcrypt.compare(password.password, user.password);
    if (!valid) throw new UnauthorizedException(`Email or password not valid.`);
    
    return await this.repository.remove(user.id)
  }
}
