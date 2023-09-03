import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import SignInDto from './dto/signin.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class AuthController {

  constructor(private readonly authService: AuthService) { }

  // create
  @Post('sign-up')
  @ApiOperation({ summary: "Create your account" })
  @ApiResponse({ status: HttpStatus.CREATED, description: "Created" })
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() signUpDto: SignInDto) {
    return this.authService.signUp(signUpDto);
  }

  // login
  @ApiOperation({ summary: "Enter in your account" })
  @ApiResponse({ status: HttpStatus.OK, description: "Ok" })
  @Post("sign-in")
  @HttpCode(HttpStatus.OK)
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

}