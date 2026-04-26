import { IsNotEmpty, IsString, Matches } from 'class-validator';
import {
  BRAZIL_PHONE_REGEX,
  BRAZIL_PHONE_VALIDATION_MESSAGE,
} from '@src/shared/utils/phone-validation.utils';

export class ActivationCodeRequest {
  @IsString()
  @IsNotEmpty()
  @Matches(BRAZIL_PHONE_REGEX, {
    message: BRAZIL_PHONE_VALIDATION_MESSAGE,
  })
  phone!: string;
}
