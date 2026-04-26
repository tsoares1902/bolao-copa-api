import { ListGuessByMatchInput } from '@src/modules/guess/application/dto/input/list-guess-by-match.input';
import { GuessOutput } from '@src/modules/guess/application/dto/output/guess.output';

export interface ListGuessByMatchUseCaseInterface {
  execute(input: ListGuessByMatchInput): Promise<GuessOutput[]>;
}
