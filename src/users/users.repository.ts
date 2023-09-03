import { Injectable } from '@nestjs/common';
import { SignUpDto } from '../auth/dtos/sign-up.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository {
  private SALT = 10;
  constructor(private readonly prisma: PrismaService) {}

  async create(userDto: SignUpDto) {
    await this.prisma.user.create({
      data: {
        ...userDto,
        password: bcrypt.hashSync(userDto.password, this.SALT),
      },
    });
  }

  async getUserById(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async getUserByEmail(email: string) {
    return await this.prisma.user.findFirst({
      where: { email },
    });
  }

  async eraseUser(id: number) {
    return this.prisma.$transaction(async (prisma) => {
      await this.deleteAllCardsFromUser(id, prisma);
      await this.deleteAllCredentialsFromUser(id, prisma);
      await this.deleteAllNotesFromUser(id, prisma);
      await this.deleteUser(id, prisma);
    });
  }

  async deleteAllCardsFromUser(id: number, px?: any) {
    const prisma = px ? px : this.prisma;
    await prisma.card.deleteMany({
      where: {
        userId: id,
      },
    });
  }

  async deleteAllNotesFromUser(id: number, px?: any) {
    await this.prisma.note.deleteMany({
      where: {
        userId: id,
      },
    });
  }

  async deleteAllCredentialsFromUser(id: number, px?: any) {
    await this.prisma.credential.deleteMany({
      where: {
        userId: id,
      },
    });
  }

  async deleteUser(id: number, px?: any) {
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
