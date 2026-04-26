import { CreateGuessInput } from '@src/modules/guess/application/dto/input/create-guess.input';
import { GuessOutput } from '@src/modules/guess/application/dto/output/guess.output';

export interface CreateGuessUseCaseInterface {
  execute(input: CreateGuessInput): Promise<GuessOutput>;
}
