import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { NewCardDTO } from './dtos/new-card.dto';
import { User } from '../decorators/user.decorator';
import { User as UserPrisma } from '@prisma/client';
import { CardsService } from './cards.service';

@Controller('cards')
@UseGuards(AuthGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  createCard(@Body() newCardDto: NewCardDTO, @User() user: UserPrisma) {
    return this.cardsService.newNote(user, newCardDto);
  }

  @Get()
  getAllCards(){
    return this.cardsService.getAllCards();
  }

  @Get('/:id')
  getOneCard(@Param('id', ParseIntPipe) id: number, @User() user: UserPrisma) {
    return this.cardsService.getOneCard(id, user.id);
  }

  @Delete('/:id')
  deleteOneCard(@Param('id', ParseIntPipe) id: number, @User() user: UserPrisma) {
    return this.cardsService.deleteOneCard(id, user.id);
  }
}
