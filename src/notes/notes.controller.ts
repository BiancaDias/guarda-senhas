import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { Users } from '@prisma/client';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('notes')
@UseGuards(AuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiOperation({ summary: "Send the notes informations" })
  @ApiResponse({ status: HttpStatus.CREATED, description: "Created" })
  create(@Body() createNotelDto: CreateNoteDto, @User() user: Users) {
    return this.notesService.create(createNotelDto, user);
  }

  @Get()
  @ApiOperation({ summary: "Get all notes informations saved" })
  @ApiResponse({ status: HttpStatus.OK, description: "Ok" })
  findAll(@User() user: Users) {
    return this.notesService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: "Get the note information by id" })
  @ApiResponse({ status: HttpStatus.OK, description: "Ok" })
  findOne(@Param('id') id: string, @User() user: Users) {
    return this.notesService.findOne(+id, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Delete the note" })
  @ApiResponse({ status: HttpStatus.OK, description: "Ok" })
  remove(@Param('id') id: string, @User() user: Users) {
    return this.notesService.remove(+id, user);
  }
}