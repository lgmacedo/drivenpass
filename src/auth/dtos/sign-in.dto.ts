import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'johndoe@mail.com', description: "user's email" })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'strongPassw0rd!', description: "user's password" })
  password: string;
}
