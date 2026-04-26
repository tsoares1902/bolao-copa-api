import { ListMyGuessInput } from '@src/modules/guess/application/dto/input/list-my-guess.input';
import { GuessOutput } from '@src/modules/guess/application/dto/output/guess.output';

export interface ListMyGuessUseCaseInterface {
  execute(input: ListMyGuessInput): Promise<GuessOutput[]>;
}
