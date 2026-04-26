import { BadRequestException } from '@nestjs/common';

import { calculateGuessPoints } from '@src/modules/guess/application/helpers/calculate-guess-points.helper';
import { validateMatchNotStarted } from '@src/modules/guess/application/helpers/validate-match-not-started.helper';
import type { MatchEntity } from '@src/modules/match/domain/entities/match.entity';
import { MatchPhase } from '@src/modules/match/domain/enums/match-phase.enum';
import { MatchStatus } from '@src/modules/match/domain/enums/match-status.enum';

const createMatchEntity = (
  overrides: Partial<MatchEntity> = {},
): MatchEntity => ({
  _id: 'match-id',
  homeTeamId: 'team-1',
  awayTeamId: 'team-2',
  stadiumId: 'stadium-id',
  matchDate: new Date('2099-06-10T20:00:00.000Z'),
  phase: MatchPhase.GROUP_STAGE,
  homeTeamScore: null,
  awayTeamScore: null,
  status: MatchStatus.SCHEDULED,
  createdAt: new Date('2026-06-01T00:00:00.000Z'),
  updatedAt: new Date('2026-06-01T00:00:00.000Z'),
  ...overrides,
});

describe('GuessHelpers', () => {
  describe('calculateGuessPoints', () => {
    it('deve retornar 10 para placar exato', () => {
      expect(
        calculateGuessPoints({
          guessedHomeScore: 2,
          guessedAwayScore: 1,
          homeTeamScore: 2,
          awayTeamScore: 1,
        }),
      ).toBe(10);
    });

    it('deve retornar 5 quando acertar apenas o resultado final', () => {
      expect(
        calculateGuessPoints({
          guessedHomeScore: 3,
          guessedAwayScore: 1,
          homeTeamScore: 2,
          awayTeamScore: 0,
        }),
      ).toBe(5);
    });

    it('deve retornar 0 quando errar o resultado final', () => {
      expect(
        calculateGuessPoints({
          guessedHomeScore: 0,
          guessedAwayScore: 1,
          homeTeamScore: 2,
          awayTeamScore: 1,
        }),
      ).toBe(0);
    });
  });

  describe('validateMatchNotStarted', () => {
    it('deve permitir partida futura', () => {
      expect(() =>
        validateMatchNotStarted(
          createMatchEntity({
            matchDate: new Date('2099-01-01T00:00:00.000Z'),
          }),
        ),
      ).not.toThrow();
    });

    it('deve lançar exceção quando a partida já tiver começado', () => {
      expect(() =>
        validateMatchNotStarted(
          createMatchEntity({
            matchDate: new Date('2020-01-01T00:00:00.000Z'),
          }),
        ),
      ).toThrow(
        new BadRequestException(
          'Guess can only be created or updated before the match starts',
        ),
      );
    });
  });
});
