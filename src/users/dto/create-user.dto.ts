import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator"
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: "myemail@gmail.com", description: "Send a email for create a account in this aplication" })
  email: string

  @IsNotEmpty()
  @ApiProperty({ example: "s3nhaSegura!", description: "Password use in this aplication" })
  @IsStrongPassword({
    minLength: 10,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1
  })
  password: string
}
