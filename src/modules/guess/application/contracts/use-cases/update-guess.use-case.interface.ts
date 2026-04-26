import { UpdateGuessInput } from '@src/modules/guess/application/dto/input/update-guess.input';
import { GuessOutput } from '@src/modules/guess/application/dto/output/guess.output';

export interface UpdateGuessUseCaseInterface {
  execute(input: UpdateGuessInput): Promise<GuessOutput>;
}
