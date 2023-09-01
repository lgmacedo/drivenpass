import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignUpDto } from '../auth/dtos/sign-up.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(userDto: SignUpDto) {
    const { email } = userDto;
    const user = await this.usersRepository.getUserByEmail(email);
    if (user) throw new ConflictException('Email already in use.');

    return await this.usersRepository.create(userDto);
  }

  async getById(id: number) {
    const user = await this.usersRepository.getUserById(id);
    if (!user) throw new NotFoundException('User not found!');

    return user;
  }

  async getUserByEmail(email: string) {
    return await this.usersRepository.getUserByEmail(email);
  }
}
