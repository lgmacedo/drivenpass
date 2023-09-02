import { IsNotEmpty, IsString } from "class-validator";

export class EraseUserDTO {
    @IsNotEmpty()
    @IsString()
    password: string;
  }