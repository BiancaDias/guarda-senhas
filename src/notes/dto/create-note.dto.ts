import { IsNotEmpty, IsString } from "class-validator"
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteDto {

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "Important", description: "Unique name from note" })
  noteTitle: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "Pay my bills", description: "Note" })
  note: string
}
