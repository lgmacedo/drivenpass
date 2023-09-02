import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class NewNoteDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  note: string;
}
