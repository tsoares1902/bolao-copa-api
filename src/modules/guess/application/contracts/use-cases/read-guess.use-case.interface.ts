import { ReadGuessInput } from '@src/modules/guess/application/dto/input/read-guess.input';
import { GuessOutput } from '@src/modules/guess/application/dto/output/guess.output';

export interface ReadGuessUseCaseInterface {
  execute(input: ReadGuessInput): Promise<GuessOutput>;
}
