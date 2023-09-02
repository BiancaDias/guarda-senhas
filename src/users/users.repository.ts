import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from "bcrypt";
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) { }
  
  async create(createUserDto: CreateUserDto) {
    return await this.prisma.users.create({ data: createUserDto})
  }
  
  login(createUserDto: CreateUserDto){
    return ""
  }
  
  async getUserByEmail(email: string) {
    return await this.prisma.users.findUnique({ where: {email}})
  }
  
  async getUserById(id: number) {
    return await this.prisma.users.findUnique({
      where: {id}
    })
  }
  
  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}