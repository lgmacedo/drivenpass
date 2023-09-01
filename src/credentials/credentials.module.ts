import { Module } from '@nestjs/common';
import { CredentialsController } from './credentials.controller';
import { CredentialsService } from './credentials.service';
import { CredentialsRepository } from './credentials.repository';
import { CryptrModule } from '../cryptr/cryptr.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [CryptrModule, UsersModule],
  controllers: [CredentialsController],
  providers: [CredentialsService, CredentialsRepository],
  exports: [CredentialsService],
})
export class CredentialsModule {}
