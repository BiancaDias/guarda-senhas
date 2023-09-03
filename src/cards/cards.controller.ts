import { Controller, Get, Post, Body, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { Users } from '@prisma/client';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('cards')
@UseGuards(AuthGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @ApiOperation({ summary: "Send the cred card informations" })
  @ApiResponse({ status: HttpStatus.CREATED, description: "Created" })
  create(@Body() createCardDto: CreateCardDto, @User() user: Users) {
    return this.cardsService.create(createCardDto, user);
  }

  @Get()
  @ApiOperation({ summary: "Get all cred card informations saved" })
  @ApiResponse({ status: HttpStatus.OK, description: "Ok" })
  findAll(@User() user: Users) {
    return this.cardsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: "Get the cred card informations by id" })
  @ApiResponse({ status: HttpStatus.OK, description: "Ok" })
  findOne(@Param('id') id: string, @User() user: Users) {
    return this.cardsService.findOne(+id, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Delete the cred card" })
  @ApiResponse({ status: HttpStatus.OK, description: "Ok" })
  remove(@Param('id') id: string, @User() user: Users) {
    return this.cardsService.remove(+id, user);
  }
}
