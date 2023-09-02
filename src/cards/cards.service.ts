import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NewCardDTO } from './dtos/new-card.dto';
import { CardsRepository } from './cards.repository';
import { User } from '@prisma/client';

@Injectable()
export class CardsService {
  constructor(private readonly cardsRepository: CardsRepository) {}

  async newNote(user: User, newCardDto: NewCardDTO) {
    const noteAlreadyExists = await this.cardsRepository.findWithUserIdAndTitle(
      user.id,
      newCardDto.title,
    );
    if (noteAlreadyExists) throw new ConflictException('Card already exists');
    return this.cardsRepository.createCard(user.id, newCardDto);
  }

  getAllCards() {
    return this.cardsRepository.getAll();
  }

  async checkCard(id: number, userId: number) {
    const card = await this.cardsRepository.getCardById(id);
    if (!card) throw new NotFoundException('Card not found');
    if (card.userId !== userId)
      throw new ForbiddenException('Card does not belong to user');
    return card;
  }

  async getOneCard(id: number, userId: number) {
    const card = await this.checkCard(id, userId);
    return card;
  }

  async deleteOneCard(id: number, userId: number) {
    await this.checkCard(id, userId);
    return this.cardsRepository.deleteCardById(id);
  }
}
