import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class NewCardDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'My credit card', description: "card's title" })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '4526 2542 4634 6345', description: "card's number" })
  number: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'John S. Doe', description: "card's name" })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '241', description: "card's code" })
  code: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '03/30', description: "card's expiration date" })
  expiration: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'topsecret_password2023',
    description: "cards's password",
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Virtual', description: "is the card's virtual?" })
  virtual: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Credit', description: "card's type" })
  type: string;
}
