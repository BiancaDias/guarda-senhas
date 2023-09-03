import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { Users } from '@prisma/client';
import { CredentialRepository } from './credentials.repository';
import Cryptr from 'cryptr';


@Injectable()
export class CredentialsService {
  private cryptr: Cryptr
  constructor(private readonly repository: CredentialRepository){
    const Cryptr = require('cryptr');
    this.cryptr = new Cryptr(process.env.SECRET_CRYPTR);
  }

  async create(createCredentialDto: CreateCredentialDto, user: Users) {
    const hash = this.cryptr.encrypt(createCredentialDto.password)
    createCredentialDto.password = hash;
    return await this.repository.create(createCredentialDto, user.id);
  }

  async findAll(user: Users) {
    const credentials = await this.repository.findAll(user.id);
    console.log(credentials)
    const credentialsDescrypt = credentials.map((credential)=>({
      id: credential.id,
      userName: credential.userName,
      password: this.cryptr.decrypt(credential.password),
      credentialTitle: credential.credentialTitle,
      url: credential.url,
      userId: credential.userId
    }))
    return credentialsDescrypt;
  }

  async findOne(id: number, user: Users) {
    const credential = await this.repository.findOne(id)
    if(!credential) throw new NotFoundException("Credential not found!")
    if(credential.userId !== user.id) throw new ForbiddenException("Forbidden");

    credential.password = this.cryptr.decrypt(credential.password)
    
    return credential;
  }

  async remove(id: number, user: Users) {
    await this.findOne(id, user)
    return await this.repository.remove(id);
  }
}
