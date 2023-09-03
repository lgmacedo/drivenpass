import { PrismaService } from '../../src/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

export class UserFactory {
  static async build(prisma: PrismaService, email?: string, password?: string) {
    const SALT = 10;
    return prisma.user.create({
      data: {
        email: email ? email : faker.internet.email(),
        password: password
          ? bcrypt.hashSync(password, SALT)
          : bcrypt.hashSync(faker.internet.password(), SALT),
      },
    });
  }
}
