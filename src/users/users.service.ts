import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from "bcrypt";
import { UsersRepository } from './users.repository';
import { NotFoundError } from 'rxjs';

@Injectable()
export class UsersService {
  
  constructor(private readonly repository: UsersRepository){}

  create(createUserDto: CreateUserDto) {
    const hash = bcrypt.hashSync(createUserDto.password, 10)
    createUserDto.password = hash;
    return this.repository.create(createUserDto)
  }

  getUserByEmail(email: string){
    return this.repository.getUserByEmail(email);
  }

  async getUserById(id: number) {
    const user = await this.repository.getUserById(id)
    if(!user) throw new NotFoundException("User not found")
    return user;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
