import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { CredentialsService } from './credentials.service';
import { NewCredentialDTO } from './dtos/new-credential.dto';
import { User } from '../decorators/user.decorator';
import { User as UserPrisma } from '@prisma/client';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Credentials')
@Controller('/credentials')
@UseGuards(AuthGuard)
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @ApiOperation({ summary: 'Creates a new credential' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credential successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request body is missing data.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Credential with given title already exists for user',
  })
  @ApiBody({ type: NewCredentialDTO })
  @Post()
  createCredential(
    @Body() newCredentialDto: NewCredentialDTO,
    @User() user: UserPrisma,
  ) {
    return this.credentialsService.newCredential(user, newCredentialDto);
  }

  @ApiOperation({ summary: 'Gets all registered credentials' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credentials successfully retrieved.',
  })
  @Get()
  getCredentials() {
    return this.credentialsService.getAllCredentials();
  }

  @ApiOperation({ summary: 'Gets a credential by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credential successfully retrieved.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Credential does not belong to user.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Credential was not found',
  })
  @ApiParam({
    name: 'id',
    description: 'id of the credential to be retrieved',
    example: 1,
  })
  @Get('/:id')
  getOneCredential(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserPrisma,
  ) {
    return this.credentialsService.getOneCredential(id, user.id);
  }

  @ApiOperation({ summary: 'Deletes a credential by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credential successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Credential does not belong to user.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Credential was not found',
  })
  @ApiParam({
    name: 'id',
    description: 'id of the credential to be deleted',
    example: 1,
  })
  @Delete('/:id')
  deleteCredential(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserPrisma,
  ) {
    return this.credentialsService.deleteCredential(id, user.id);
  }
}
