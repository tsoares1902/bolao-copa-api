import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import {
  BRAZIL_PHONE_REGEX,
  BRAZIL_PHONE_VALIDATION_MESSAGE,
} from '@src/shared/utils/phone-validation.utils';

export class SignInInput {
  @IsString()
  @IsNotEmpty()
  @Matches(BRAZIL_PHONE_REGEX, {
    message: BRAZIL_PHONE_VALIDATION_MESSAGE,
  })
  phone!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, {
    message: 'password must be at least 6 characters',
  })
  password!: string;
}
