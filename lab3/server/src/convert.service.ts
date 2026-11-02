import { Injectable } from '@nestjs/common';

const UNITS = ['C', 'F', 'K'] as const;

export type TemperatureUnit = (typeof UNITS)[number];

const NUMBER_PATTERN = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;

function isUnit(value: string): value is TemperatureUnit {
  return (UNITS as readonly string[]).includes(value);
}

function formatInput(value: number): string {
  if (Object.is(value, -0)) {
    return '0';
  }
  return value.toString();
}

@Injectable()
export class ConvertService {
  toCelsius(value: number, unit: TemperatureUnit): number {
    switch (unit) {
      case 'C':
        return value;
      case 'F':
        return ((value - 32) * 5) / 9;
      case 'K':
        return value - 273.15;
    }
  }

  fromCelsius(value: number, unit: TemperatureUnit): number {
    switch (unit) {
      case 'C':
        return value;
      case 'F':
        return (value * 9) / 5 + 32;
      case 'K':
        return value + 273.15;
    }
  }

  convert(value: number, source: TemperatureUnit, destination: TemperatureUnit): number {
    return this.fromCelsius(this.toCelsius(value, source), destination);
  }

  format(rawValue: unknown, rawSource: unknown, rawDestination: unknown): string {
    if (typeof rawValue !== 'string' || typeof rawSource !== 'string' || typeof rawDestination !== 'string') {
      throw new Error('bad request');
    }

    const valueText = rawValue.trim();
    if (!NUMBER_PATTERN.test(valueText)) {
      throw new Error('bad value');
    }

    const value = Number(valueText);
    if (!Number.isFinite(value)) {
      throw new Error('bad value');
    }

    const source = rawSource.trim().toUpperCase();
    const destination = rawDestination.trim().toUpperCase();
    if (!isUnit(source) || !isUnit(destination)) {
      throw new Error('bad unit');
    }

    const converted = this.convert(value, source, destination);
    if (!Number.isFinite(converted)) {
      throw new Error('bad result');
    }

    return `${formatInput(value)} ${source} = ${converted.toFixed(2)} ${destination}`;
  }
}
