import { IsAlpha, IsBoolean, IsNotEmpty, IsNumber, IsString, Length } from "class-validator"
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "MyNubank", description: "Unique name from card" })
  cardTitle: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "12345678945612345", description: "Card Number" })
  cardNumber: string

  @IsAlpha()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "John Smith", description: "Name printed on card" })
  cardName: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "123", description: "Security code printed on card" })
  secutityCode: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "12/28", description: "Expiration date printed on card" })
  expirationDate: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "1234", description: "Password from card" })
  password: string

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ example: "true", description: "The card is virtual?" })
  virtual: boolean

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ example: "false", description: "The card is credit?" })
  isCredit: boolean

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ example: "true", description: "The card is debit?" })
  isDebit: boolean
}
