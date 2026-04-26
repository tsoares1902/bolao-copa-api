import { CalculateGuessPointsInput } from '@src/modules/guess/application/dto/input/calculate-guess-points.input';
import { GuessOutput } from '@src/modules/guess/application/dto/output/guess.output';

export interface CalculateGuessPointsUseCaseInterface {
  execute(input: CalculateGuessPointsInput): Promise<GuessOutput[]>;
}
