import { IsNotEmpty, IsString, IsUrl } from "class-validator"

export class CreateCredentialDto {

  @IsString()
  @IsNotEmpty()
  userName: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsString()
  @IsNotEmpty()
  credentialTitle: string

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url: string
}
