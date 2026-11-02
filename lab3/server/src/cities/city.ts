import type { ClimateName } from '../climate/climate.rules';

export interface CityClues {
  tempRange: string;
  rainfall: string;
  seasonFeel: string;
}

export interface City {
  id: string;
  name: string;
  climate: ClimateName;
  clues: CityClues;
  explanation: string;
}
