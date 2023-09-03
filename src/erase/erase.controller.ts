import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { Users } from '@prisma/client';
import { EraseService } from './erase.service';
import { EraseDto } from './dto/erase.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('erase')
@UseGuards(AuthGuard)
@Controller('erase')
export class EraseController {
  constructor(private readonly cardsService: EraseService) {}

  @Delete()
  @ApiOperation({ summary: "Delete all your informations in this aplication" })
  @ApiResponse({ status: HttpStatus.OK, description: "OK" })
  remove(@Body() password: EraseDto, @User() user: Users) {
    return this.cardsService.remove(password, user);
  }
}