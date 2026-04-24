import { IsNotEmpty, IsString } from 'class-validator';

export class MidiaRequest {
  @IsString()
  @IsNotEmpty()
  photoUrl!: string;
}
