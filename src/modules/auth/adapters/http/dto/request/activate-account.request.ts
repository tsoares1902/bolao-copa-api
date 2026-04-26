import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import {
  BRAZIL_PHONE_REGEX,
  BRAZIL_PHONE_VALIDATION_MESSAGE,
} from '@src/shared/utils/phone-validation.utils';

export class ActivateAccountRequest {
  @IsString()
  @IsNotEmpty()
  @Matches(BRAZIL_PHONE_REGEX, {
    message: BRAZIL_PHONE_VALIDATION_MESSAGE,
  })
  phone!: string;

  @IsString()
  @Length(6, 6)
  code!: string;
}
