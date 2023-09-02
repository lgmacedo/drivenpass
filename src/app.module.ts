import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CredentialsModule } from './credentials/credentials.module';
import { CryptrModule } from './cryptr/cryptr.module';
import { NotesModule } from './notes/notes.module';
import { CardsModule } from './cards/cards.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, CredentialsModule, CryptrModule, NotesModule, CardsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
