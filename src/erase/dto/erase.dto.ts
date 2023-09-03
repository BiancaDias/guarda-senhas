import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class EraseDto {
  
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "S3nhASegura!", description: "My password for access this aplication" })
  password: string
}