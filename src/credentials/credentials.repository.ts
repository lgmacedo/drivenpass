import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NewCredentialDTO } from './dtos/new-credential.dto';
import { CryptrService } from '../cryptr/cryptr.service';

@Injectable()
export class CredentialsRepository {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CryptrService) private readonly cryptr: CryptrService,
  ) {}

  async insertNewCredential(userId: number, data: NewCredentialDTO) {
    await this.prisma.credential.create({
      data: {
        ...data,
        password: this.cryptr.encrypt(data.password),
        userId,
      },
    });
  }

  async getAllCredentials() {
    return await this.prisma.credential.findMany();
  }

  async getCredentialWithUserIdAndTitle(userId: number, title: string) {
    return await this.prisma.credential.findFirst({
      where: {
        userId,
        title,
      },
    });
  }

  async getOneCredential(id: number) {
    return await this.prisma.credential.findUnique({
      where: {
        id,
      },
    });
  }

  async deleteCredential(id: number) {
    return await this.prisma.credential.delete({
      where: {
        id,
      },
    });
  }
}
