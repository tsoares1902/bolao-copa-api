import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ActivateAccountRequest {
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @Length(6, 6)
  code!: string;
}
