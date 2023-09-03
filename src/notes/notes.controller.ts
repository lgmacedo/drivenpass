import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Notes')
@Controller('notes')
@UseGuards(AuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @ApiOperation({ summary: 'Creates a new note' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Note successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request body is missing data.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Note with given title already exists for user',
  })
  @ApiBody({ type: NewNoteDTO })
  @Post()
  createNote(@Body() newNoteDto: NewNoteDTO, @User() user: UserPrisma) {
    return this.notesService.newNote(user, newNoteDto);
  }

  @ApiOperation({ summary: 'Retrieves all registered notes' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Notes successfully retrieved.',
  })
  @Get()
  getNotes() {
    return this.notesService.getAll();
  }

  @ApiOperation({ summary: 'Gets a note by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Note successfully retrieved.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Note does not belong to user.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Note was not found',
  })
  @ApiParam({
    name: 'id',
    description: 'id of the note to be retrieved',
    example: 1,
  })
  @Get('/:id')
  getOneNote(@Param('id', ParseIntPipe) id: number, @User() user: UserPrisma) {
    return this.notesService.getOneNote(id, user.id);
  }

  @ApiOperation({ summary: 'Deletes a note by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Note successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Note does not belong to user.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Note was not found',
  })
  @ApiParam({
    name: 'id',
    description: 'id of the note to be deleted',
    example: 1,
  })
  @Delete('/:id')
  deleteNote(@Param('id', ParseIntPipe) id: number, @User() user: UserPrisma) {
    return this.notesService.deleteNote(id, user.id);
  }
}
