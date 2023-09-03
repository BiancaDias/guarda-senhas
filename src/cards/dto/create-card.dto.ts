import { IsAlpha, IsBoolean, IsNotEmpty, IsNumber, IsString, Length } from "class-validator"

export class CreateCardDto {

  @IsString()
  @IsNotEmpty()
  cardTitle: string

  @IsString()
  @IsNotEmpty()
  @Length(16, 16)
  cardNumber: string

  @IsAlpha()
  @IsString()
  @IsNotEmpty()
  cardName: string

  @IsNumber()
  @IsNotEmpty()
  secutityCode: number

  @IsString()
  @IsNotEmpty()
  expirationDate: string

  @IsNumber()
  @IsNotEmpty()
  password: number

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
