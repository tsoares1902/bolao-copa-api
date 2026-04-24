import { DeleteMatchInput } from '@src/modules/match/application/dto/input/delete-match.input';

export interface DeleteMatchUseCaseInterface {
  execute(input: DeleteMatchInput): Promise<void>;
}
