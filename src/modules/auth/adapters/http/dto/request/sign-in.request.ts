import { IsNotEmpty, IsString } from 'class-validator';

export class SignInRequest {
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
