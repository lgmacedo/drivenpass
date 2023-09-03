import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'johndoe@mail.com', description: "user's email" })
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @ApiProperty({ example: 'strongPassw0rd!', description: "user's password" })
  password: string;
}
