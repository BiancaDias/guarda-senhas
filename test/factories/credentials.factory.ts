import { PrismaService } from  "../../src/prisma/prisma.service";
import Cryptr from 'cryptr';

export class CredentialFactory {
  private userName: string;
  private password: string;
  private credentialTitle: string;
  private userId: number
  private url: string
  private cryptr: Cryptr
  constructor(private readonly prisma: PrismaService) { 
    const Cryptr = require('cryptr');
    this.cryptr = new Cryptr(process.env.SECRET_CRYPTR);
  }

  setUserId(userId: number){
    return this.userId = userId;
  }
  setUsername(userName: string){
    return this.userName = userName
  }

  setPassword(password: string){
    return this.password = this.cryptr.encrypt(password);
  }

  setCredentialTitle(credentialTitle: string){
    return this.credentialTitle = credentialTitle;
  }

  setUrl(url: string){
    return this.url = url;
  }

  build() {
    return {
      userName: this.userName,
      password: this.password,
      credentialTitle: this.credentialTitle,
      userId: this.userId,
      url: this.url
    }
  }
  async persist() {
    const data = this. build();
    return await this.prisma.credentials.create({data})
  }
}