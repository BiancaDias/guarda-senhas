import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { Users } from '@prisma/client';
import { EraseService } from './erase.service';
import { EraseDto } from './dto/erase.dto';

@UseGuards(AuthGuard)
@Controller('erase')
export class EraseController {
  constructor(private readonly cardsService: EraseService) {}

  @Delete()
  remove(@Body() password: EraseDto, @User() user: Users) {
    return this.cardsService.remove(password, user);
  }
}