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
import { NewCardDTO } from './dtos/new-card.dto';
import { User } from '../decorators/user.decorator';
import { User as UserPrisma } from '@prisma/client';
import { CardsService } from './cards.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Cards')
@Controller('cards')
@UseGuards(AuthGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @ApiOperation({ summary: 'Creates a new card' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Card successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request body is missing data.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Card with given title already exists for user',
  })
  @ApiBody({ type: NewCardDTO })
  @Post()
  createCard(@Body() newCardDto: NewCardDTO, @User() user: UserPrisma) {
    return this.cardsService.newNote(user, newCardDto);
  }

  @ApiOperation({ summary: 'Gets all registered cards' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cards successfully retrieved.',
  })
  @Get()
  getAllCards() {
    return this.cardsService.getAllCards();
  }

  @ApiOperation({ summary: 'Gets a card by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Card successfully retrieved.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Card does not belong to user.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Card was not found',
  })
  @ApiParam({
    name: 'id',
    description: 'id of the card to be retrieved',
    example: 1,
  })
  @Get('/:id')
  getOneCard(@Param('id', ParseIntPipe) id: number, @User() user: UserPrisma) {
    return this.cardsService.getOneCard(id, user.id);
  }

  @ApiOperation({ summary: 'Deletes a card by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Card successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Card does not belong to user.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Card was not found',
  })
  @ApiParam({
    name: 'id',
    description: 'id of the card to be deleted',
    example: 1,
  })
  @Delete('/:id')
  deleteOneCard(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserPrisma,
  ) {
    return this.cardsService.deleteOneCard(id, user.id);
  }
}
