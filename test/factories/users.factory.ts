import { PrismaService } from  "../../src/prisma/prisma.service";
import * as bcrypt from "bcrypt";

export class UserFactory {
  private email: string;
  private password: string;

  constructor(private readonly prisma: PrismaService) { }

  setEmail(email: string){
    return this.email = email
  }

  setPassword(password: string){
    const hash = bcrypt.hashSync(password, 10)
    return this.password = hash
  }

  build() {
    return {
      email: this.email,
      password: this.password
    }
  }
  async persist() {
    const data = this. build();
    return await this.prisma.users.create({data})
  }
}