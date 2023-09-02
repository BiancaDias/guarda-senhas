import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from '@prisma/client';
import SignInDto from './dto/signin.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {

  private EXPIRATION_TIME = "7 days";
  private ISSUER = "Bianca";
  private AUDIENCE = "users";

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService) { }

  async signUp(signUpDto: SignInDto) {
    return await this.usersService.create(signUpDto);
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.usersService.getUserByEmail(email)

    if (!user) throw new UnauthorizedException(`Email or password not valid.`);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException(`Email or password not valid.`);
    return this.createToken(user);
  }

  private async createToken(user: Users) {
    const { id, email } = user;

    const token = this.jwtService.sign({ email }, {
      expiresIn: this.EXPIRATION_TIME,
      subject: String(id),
      issuer: this.ISSUER,
      audience: this.AUDIENCE
    });

    return { token }
  }

  checkToken(token: string) {
    const data = this.jwtService.verify(token, {
      audience: this.AUDIENCE,
      issuer: this.ISSUER
    });
    return data;
  }

}