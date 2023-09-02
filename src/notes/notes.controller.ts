import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { Users } from '@prisma/client';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';

@UseGuards(AuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() createNotelDto: CreateNoteDto, @User() user: Users) {
    return this.notesService.create(createNotelDto, user);
  }

  @Get()
  findAll(@User() user: Users) {
    return this.notesService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() user: Users) {
    return this.notesService.findOne(+id, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: Users) {
    return this.notesService.remove(+id, user);
  }
}