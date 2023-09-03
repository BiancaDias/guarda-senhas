import { IsNotEmpty, IsString, IsUrl } from "class-validator"
import { ApiProperty } from '@nestjs/swagger';

export class CreateCredentialDto {

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "@Iinsta", description: "My username" })
  userName: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "s3NhaSegura!", description: "Password" })
  password: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "MyInstagram", description: "Unique title for this password" })
  credentialTitle: string

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({ example: "https://www.instagram.com/!", description: "Url from site" })
  url: string
}
