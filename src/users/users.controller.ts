import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Delete(':id')
  @ApiOperation({ summary: "Delete your account" })
  @ApiResponse({ status: HttpStatus.OK, description: "Ok" })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
