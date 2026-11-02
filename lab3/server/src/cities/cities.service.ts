import { Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';
import { CITIES } from './cities.data';
import type { City } from './city';

@Injectable()
export class CitiesService {
  private readonly cities: readonly City[] = CITIES;

  pickRandom(excludeId: string | null): City {
    const pool =
      excludeId && this.cities.length > 1
        ? this.cities.filter((city) => city.id !== excludeId)
        : this.cities;
    const index = randomInt(pool.length);
    const city = pool[index];
    if (!city) {
      throw new Error('City list is empty.');
    }
    return city;
  }

  require(id: string): City {
    const city = this.cities.find((item) => item.id === id);
    if (!city) {
      throw new Error(`Unknown city ${id}.`);
    }
    return city;
  }
}
