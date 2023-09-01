import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { CredentialsService } from './credentials.service';
import { NewCredentialDTO } from './dtos/new-credential.dto';
import { User } from '../decorators/user.decorator';
import { User as UserPrisma } from '@prisma/client';

@Controller('/credentials')
@UseGuards(AuthGuard)
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post()
  signUp(@Body() newCredentialDto: NewCredentialDTO, @User() user: UserPrisma) {
    return this.credentialsService.newCredential(user, newCredentialDto);
  }

  @Get()
  getCredentials() {
    return this.credentialsService.getAllCredentials();
  }

  @Get('/:id')
  getOneCredential(@Param('id', ParseIntPipe) id: number, @User() user: UserPrisma) {
    return this.credentialsService.getOneCredential(id, user.id);
  }

  @Delete('/:id')
  deleteCredential(@Param('id', ParseIntPipe) id: number, @User() user: UserPrisma){
    return this.credentialsService.deleteCredential(id, user.id);
  }
}
