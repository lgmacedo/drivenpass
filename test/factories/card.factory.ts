import { PrismaService } from '../../src/prisma/prisma.service';
import { faker } from '@faker-js/faker';

export class CardFactory {
  static async build(prisma: PrismaService, title?: string, userId?: number) {
    return prisma.card.create({
      data: {
        title: title ? title : faker.internet.domainName(),
        userId: userId ? userId : faker.number.int(),
        number: faker.number.bigInt().toString(),
        name: faker.person.fullName(),
        code: faker.number.int().toString(),
        expiration: faker.date.future.toString(),
        password: faker.internet.password(),
        virtual: 'Virtual',
        type: 'Credit',
      },
    });
  }
}
