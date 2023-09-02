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

  async deleteAllCardsFromUser(id: number) {
    await this.prisma.card.deleteMany({
      where: {
        userId: id,
      },
    });
  }

  async deleteAllNotesFromUser(id: number) {
    await this.prisma.note.deleteMany({
      where: {
        userId: id,
      },
    });
  }

  async deleteAllCredentialsFromUser(id: number) {
    await this.prisma.credential.deleteMany({
      where: {
        userId: id,
      },
    });
  }

  async deleteUser(id: number) {
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
