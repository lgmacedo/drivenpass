import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NewNoteDTO } from './dtos/new-note.dto';

@Injectable()
export class NotesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return await this.prisma.note.findMany();
  }

  async getNoteById(id: number) {
    return await this.prisma.note.findFirst({
      where: {
        id,
      },
    });
  }

  async findWithUserIdAndTitle(userId: number, title: string) {
    return await this.prisma.note.findFirst({
      where: {
        userId,
        title,
      },
    });
  }

  async newNote(userId: number, data: NewNoteDTO) {
    await this.prisma.note.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async deleteNote(id: number) {
    await this.prisma.note.delete({
      where: {
        id,
      },
    });
  }
}
