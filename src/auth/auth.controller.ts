import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Sign-up and Sign-in')
@Controller('/users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  @ApiOperation({ summary: 'Sign-up' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully signed-up.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email is already being used.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Request body is missing data or password is not strong enough',
  })
  @ApiBody({ type: SignUpDto })
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign-in' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully signed-in.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Email or password provided are not valid.',
  })
  @ApiBody({ type: SignInDto })
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
