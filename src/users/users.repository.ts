import { Injectable } from '@nestjs/common';
import { SignUpDto } from '../auth/dtos/sign-up.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from "bcrypt";


@Injectable()
export class UsersRepository {

  private SALT = 10;
  constructor(private readonly prisma: PrismaService) { }

  create(userDto: SignUpDto) {
    return this.prisma.user.create({
      data: {
        ...userDto,
        password: bcrypt.hashSync(userDto.password, this.SALT)
      }
    })
  }

  getUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id }
    })
  }

  getUserByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email }
    })
  }
}