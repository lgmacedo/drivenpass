import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotesRepository } from './notes.repository';
import { User } from '@prisma/client';
import { NewNoteDTO } from './dtos/new-note.dto';

@Injectable()
export class NotesService {
  constructor(private readonly notesRepository: NotesRepository) {}

  getAll() {
    return this.notesRepository.getAll();
  }

  async checkNote(id: number, userId: number) {
    const note = await this.notesRepository.getNoteById(id);
    if (!note) throw new NotFoundException('Note not found');
    if (note.userId !== userId)
      throw new ForbiddenException('Note does not belong to user');
    return note;
  }

  async getOneNote(id: number, userId: number) {
    const note = this.checkNote(id, userId);
    return note;
  }

  async newNote(user: User, newNoteDto: NewNoteDTO) {
    const noteAlreadyExists = await this.notesRepository.findWithUserIdAndTitle(
      user.id,
      newNoteDto.title,
    );
    if (noteAlreadyExists) throw new ConflictException('Note already exists');
    return this.notesRepository.newNote(user.id, newNoteDto);
  }

  async deleteNote(id: number, userId: number) {
    await this.checkNote(id, userId);
    await this.notesRepository.deleteNote(id);
  }
}
