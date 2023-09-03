import { Body, Controller, Delete, HttpStatus, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User as UserPrisma } from '@prisma/client';
import { User } from '../decorators/user.decorator';
import { EraseUserDTO } from './dtos/erase-user.dto';
import { AuthGuard } from '../guards/auth.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller()
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Deletes all user data given and user Id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Password does not match.',
  })
  @ApiBody({ type: EraseUserDTO })
  @Delete('/erase')
  eraseUser(@User() user: UserPrisma, @Body() eraseUserDTO: EraseUserDTO) {
    return this.usersService.eraseUser(user, eraseUserDTO.password);
  }
}
