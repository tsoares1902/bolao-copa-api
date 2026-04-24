import { MatchGroup } from '@src/modules/match/domain/enums/match-group.enum';
import { MatchPhase } from '@src/modules/match/domain/enums/match-phase.enum';
import { MatchStatus } from '@src/modules/match/domain/enums/match-status.enum';

export class MatchResponse {
  _id!: string;
  homeTeamId!: string;
  awayTeamId!: string;
  stadiumId!: string;
  matchDate!: Date;
  phase!: MatchPhase;
  groupName?: MatchGroup;
  homeTeamScore?: number | null;
  awayTeamScore?: number | null;
  status!: MatchStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
