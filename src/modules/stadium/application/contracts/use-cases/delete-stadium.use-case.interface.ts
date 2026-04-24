import { DeleteStadiumInput } from '@src/modules/stadium/application/dto/input/delete-stadium.input';

export interface DeleteStadiumUseCaseInterface {
  execute(input: DeleteStadiumInput): Promise<void>;
}
