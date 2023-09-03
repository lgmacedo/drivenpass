import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EraseUserDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'strongPassw0rd!', description: "user's password" })
  password: string;
}
