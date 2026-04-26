import { CreateGuessInput } from '@src/modules/guess/application/dto/input/create-guess.input';
import { UpdateGuessInput } from '@src/modules/guess/application/dto/input/update-guess.input';
import { GuessEntity } from '@src/modules/guess/domain/entities/guess.entity';

export interface GuessRepositoryInterface {
  list(): Promise<GuessEntity[]>;
  create(input: CreateGuessInput): Promise<GuessEntity>;
  read(guessId: string): Promise<GuessEntity | null>;
  listByUser(userId: string): Promise<GuessEntity[]>;
  listByMatch(matchId: string): Promise<GuessEntity[]>;
  findByUserAndMatch(input: {
    userId: string;
    matchId: string;
  }): Promise<GuessEntity | null>;
  update(input: UpdateGuessInput): Promise<GuessEntity | null>;
  updatePoints(input: {
    guessId: string;
    pointsEarned: number;
  }): Promise<GuessEntity | null>;
  delete(guessId: string): Promise<void>;
}
