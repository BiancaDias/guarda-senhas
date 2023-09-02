import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import SignInDto from './dto/signin.dto';

@Controller('users')
export class AuthController {

  constructor(private readonly authService: AuthService) { }

  // create
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() signUpDto: SignInDto) {
    return this.authService.signUp(signUpDto);
  }

  // login
  @Post("sign-in")
  @HttpCode(HttpStatus.OK)
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

}