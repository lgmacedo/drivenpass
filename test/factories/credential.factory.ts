import { PrismaService } from '../../src/prisma/prisma.service';
import { faker } from '@faker-js/faker';

export class CredentialFactory {
  static async build(prisma: PrismaService, title?: string, userId?: number) {
    const Cryptr = require('cryptr');
    const cryptr = new Cryptr(process.env.CRYPTR_KEY);
    return prisma.credential.create({
      data: {
        title: title ? title : faker.internet.domainName(),
        userId: userId ? userId : faker.number.int(),
        url: faker.internet.url(),
        username: faker.internet.displayName(),
        password: cryptr.encrypt(faker.internet.password()),
      },
    });
  }
}
