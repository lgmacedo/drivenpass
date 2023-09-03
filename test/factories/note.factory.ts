import { PrismaService } from '../../src/prisma/prisma.service';
import { faker } from '@faker-js/faker';

export class NoteFactory {
  static async build(prisma: PrismaService, title?: string, userId?: number) {
    return prisma.note.create({
      data: {
        title: title ? title : faker.internet.domainName(),
        userId: userId ? userId : faker.number.int(),
        note: faker.person.jobDescriptor(),
      },
    });
  }
}
