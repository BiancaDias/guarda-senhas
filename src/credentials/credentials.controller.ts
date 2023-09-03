import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { Users } from '@prisma/client';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('credentials')
@UseGuards(AuthGuard)
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post()
  @ApiOperation({ summary: "Send the credential informations" })
  @ApiResponse({ status: HttpStatus.CREATED, description: "Created" })
  create(@Body() createCredentialDto: CreateCredentialDto, @User() user: Users) {
    return this.credentialsService.create(createCredentialDto, user);
  }

  @Get()
  @ApiOperation({ summary: "Get all credentials informations" })
  @ApiResponse({ status: HttpStatus.OK, description: "Ok" })
  findAll(@User() user: Users) {
    return this.credentialsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: "Get the credential informations by id" })
  @ApiResponse({ status: HttpStatus.OK, description: "Ok" })
  findOne(@Param('id') id: string, @User() user: Users) {
    return this.credentialsService.findOne(+id, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Delete the credentials informations" })
  @ApiResponse({ status: HttpStatus.OK, description: "Ok" })
  remove(@Param('id') id: string, @User() user: Users) {
    return this.credentialsService.remove(+id, user);
  }
}
