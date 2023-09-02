import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NewCardDTO } from './dtos/new-card.dto';
import { CryptrService } from '../cryptr/cryptr.service';

@Injectable()
export class CardsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptr: CryptrService,
  ) {}

  async getAll() {
    return await this.prisma.card.findMany();
  }

  async getCardById(id: number) {
    return await this.prisma.card.findFirst({
      where: {
        id,
      },
    });
  }

  async createCard(userId: number, data: NewCardDTO) {
    await this.prisma.card.create({
      data: {
        ...data,
        code: this.cryptr.encrypt(data.code),
        password: this.cryptr.encrypt(data.password),
        userId,
      },
    });
  }

  async findWithUserIdAndTitle(userId: number, title: string) {
    return await this.prisma.card.findFirst({
      where: {
        userId,
        title,
      },
    });
  }

  async deleteCardById(id: number) {
    await this.prisma.card.delete({
      where: {
        id,
      },
    });
  }
}
