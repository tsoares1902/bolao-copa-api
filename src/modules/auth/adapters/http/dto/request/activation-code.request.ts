import { IsNotEmpty, IsString } from 'class-validator';

export class ActivationCodeRequest {
  @IsString()
  @IsNotEmpty()
  phone!: string;
}
