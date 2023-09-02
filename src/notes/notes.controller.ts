import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { NewNoteDTO } from './dtos/new-note.dto';
import { User as UserPrisma } from '@prisma/client';
import { NotesService } from './notes.service';
import { User } from '../decorators/user.decorator';

@Controller('notes')
@UseGuards(AuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  createNote(@Body() newNoteDto: NewNoteDTO, @User() user: UserPrisma) {
    return this.notesService.newNote(user, newNoteDto);
  }

  @Get()
  getNotes() {
    return this.notesService.getAll();
  }

  @Get('/:id')
  getOneNote(@Param('id', ParseIntPipe) id: number, @User() user: UserPrisma) {
    return this.notesService.getOneNote(id, user.id);
  }

  @Delete('/:id')
  deleteNote(@Param('id', ParseIntPipe) id: number, @User() user: UserPrisma) {
    return this.notesService.deleteNote(id, user.id);
  }
}
