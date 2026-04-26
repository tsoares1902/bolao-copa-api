import { DeleteGuessInput } from '@src/modules/guess/application/dto/input/delete-guess.input';

export interface DeleteGuessUseCaseInterface {
  execute(input: DeleteGuessInput): Promise<void>;
}
