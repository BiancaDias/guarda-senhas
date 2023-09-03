import { IsAlpha, IsBoolean, IsNotEmpty, IsNumber, IsString, Length } from "class-validator"

export class CreateCardDto {

  @IsString()
  @IsNotEmpty()
  cardTitle: string

  @IsString()
  @IsNotEmpty()
  cardNumber: string

  @IsAlpha()
  @IsString()
  @IsNotEmpty()
  cardName: string

  @IsString()
  @IsNotEmpty()
  secutityCode: string

  @IsString()
  @IsNotEmpty()
  expirationDate: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsNotEmpty()
  @IsBoolean()
  virtual: boolean

  @IsNotEmpty()
  @IsBoolean()
  isCredit: boolean

  @IsNotEmpty()
  @IsBoolean()
  isDebit: boolean
}
