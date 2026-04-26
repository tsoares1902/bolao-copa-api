import { GuessOutput } from '@src/modules/guess/application/dto/output/guess.output';

export interface ListGuessUseCaseInterface {
  execute(): Promise<GuessOutput[]>;
}
