import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CitiesService } from '../cities/cities.service';
import type { ClimateName } from '../climate/climate.rules';

interface StoredRound {
  cityId: string;
  answered: boolean;
}

export interface RoundClues {
  tempRange: string;
  rainfall: string;
  season: string;
}

export interface RoundResponse {
  roundId: string;
  clues: RoundClues;
}

export interface GuessResponse {
  correct: boolean;
  city: string;
  climate: ClimateName;
  explanation: string;
}

export interface ScoreResponse {
  correct: number;
  attempts: number;
}

@Injectable()
export class GameService {
  private readonly rounds = new Map<string, StoredRound>();
  private correct = 0;
  private attempts = 0;
  private lastCityId: string | null = null;

  constructor(private readonly citiesService: CitiesService) {}

  startRound(): RoundResponse {
    const city = this.citiesService.pickRandom(this.lastCityId);
    this.lastCityId = city.id;
    const roundId = randomUUID();
    this.rounds.set(roundId, { cityId: city.id, answered: false });
    return {
      roundId,
      clues: {
        tempRange: city.clues.tempRange,
        rainfall: city.clues.rainfall,
        season: city.clues.seasonFeel,
      },
    };
  }

  guess(roundId: string, climate: ClimateName): GuessResponse {
    const round = this.rounds.get(roundId);
    if (!round) {
      throw new BadRequestException('That round does not exist. Start a new round.');
    }
    if (round.answered) {
      throw new BadRequestException('That round was already guessed. Start a new round.');
    }

    const city = this.citiesService.require(round.cityId);
    round.answered = true;
    this.attempts += 1;
    const correct = city.climate === climate;
    if (correct) {
      this.correct += 1;
    }

    return {
      correct,
      city: city.name,
      climate: city.climate,
      explanation: city.explanation,
    };
  }

  score(): ScoreResponse {
    return {
      correct: this.correct,
      attempts: this.attempts,
    };
  }
}
