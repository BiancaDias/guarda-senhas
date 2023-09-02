import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { Users } from '@prisma/client';
import { CredentialRepository } from './credentials.repository';
import Cryptr from 'cryptr';


@Injectable()
export class CredentialsService {
 
  constructor(private readonly repository: CredentialRepository){}

  async create(createCredentialDto: CreateCredentialDto, user: Users) {
    const cryptr = new Cryptr("MyKey")
    const hash = cryptr.encrypt(createCredentialDto.password)
    createCredentialDto.password = hash;
    return await this.repository.create(createCredentialDto, user.id);
  }

  async findAll(user: Users) {
    const cryptr = new Cryptr("MyKey")
    const credentials = await this.repository.findAll(user.id);
    const credentialsDescrypt = credentials.map((credential)=>({
      ...credential,
      password: cryptr.decrypt(credential.password)
    }))
    return credentialsDescrypt;
  }

  async findOne(id: number, user: Users) {
    const cryptr = new Cryptr("MyKey")
    const credential = await this.repository.findOne(id)
    if(!credential) throw new NotFoundException("Credential not found!")
    if(credential.userId !== user.id) throw new ForbiddenException("Forbidden");

    credential.password = cryptr.decrypt(credential.password)
    
    return credential;
  }

  async remove(id: number, user: Users) {
    const credential = await this.findOne(id, user)
    return await this.repository.remove(id);
  }
}
