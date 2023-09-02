import { Module } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CredentialsController } from './credentials.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CredentialRepository } from './credentials.repository';
import { UsersModule } from '../users/users.module';
import { PrismaService } from 'nestjs-prisma';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [CredentialsController],
  providers: [CredentialsService, CredentialRepository, PrismaService],
  exports: [CredentialsService]
})
export class CredentialsModule {} 
