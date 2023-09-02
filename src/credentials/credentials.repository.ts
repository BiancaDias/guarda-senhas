import { Injectable } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class CredentialRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(createCredentialDto: CreateCredentialDto, userId: number) {
    return await this.prisma.credentials.create({
      data: {
        userName: createCredentialDto.userName,
        password: createCredentialDto.password,
        credentialTitle: createCredentialDto.credentialTitle,
        userId
      }
    })
  }

  //FIXME desencriptar a senha
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
