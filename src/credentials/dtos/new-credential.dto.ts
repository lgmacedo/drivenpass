import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class NewCredentialDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'My facebook', description: "credential's title" })
  title: string;

  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({ example: 'www.facebook.com', description: "credential's url" })
  url: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'johndoe1998', description: "credential's username" })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'top_secretJoe',
    description: "credential's password",
  })
  password: string;
}
