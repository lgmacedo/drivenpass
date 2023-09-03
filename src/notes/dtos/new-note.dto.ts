import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class NewNoteDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'New note', description: "note's title" })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'The content of the note',
    description: "notes's content",
  })
  note: string;
}
