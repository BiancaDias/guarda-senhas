import { IsNotEmpty, IsString } from "class-validator"

export class CreateNoteDto {

  @IsString()
  @IsNotEmpty()
  noteTitle: string

  @IsString()
  @IsNotEmpty()
  note: string
}