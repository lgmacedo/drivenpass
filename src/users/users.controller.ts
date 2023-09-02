import { Body, Controller, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User as UserPrisma } from '@prisma/client';
import { User } from '../decorators/user.decorator';
import { EraseUserDTO } from './dtos/erase-user.dto';
import { AuthGuard } from '../guards/auth.guard';

@Controller()
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Delete('/erase')
  eraseUser(@User() user: UserPrisma, @Body() eraseUserDTO: EraseUserDTO) {
    return this.usersService.eraseUser(user, eraseUserDTO.password);
  }
}
