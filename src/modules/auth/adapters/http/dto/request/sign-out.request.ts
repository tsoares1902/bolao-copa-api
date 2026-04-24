import { IsNotEmpty, IsString } from 'class-validator';

export class SignOutRequest {
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
