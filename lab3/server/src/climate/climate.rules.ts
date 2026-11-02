export const CLIMATE_NAMES = [
  'tropical',
  'dry',
  'temperate',
  'continental',
  'polar',
] as const;

export type ClimateName = (typeof CLIMATE_NAMES)[number];

export interface ClimateReading {
  averageHighC: number;
  annualRainfallMm: number;
  humidityPercent: number;
}

export interface ClimateClassification {
  climate: ClimateName;
  reason: string;
  weatherNote: string;
}

/**
 * Cutoffs are applied in this order: polar, tropical, dry, continental.
 * A reading that misses every cutoff is temperate.
 */
export const POLAR_MAX_AVERAGE_HIGH_C = 10;
export const TROPICAL_MIN_AVERAGE_HIGH_C = 26;
export const TROPICAL_MIN_ANNUAL_RAINFALL_MM = 1500;
export const TROPICAL_MIN_HUMIDITY_PERCENT = 70;
export const DRY_MAX_ANNUAL_RAINFALL_MM = 400;
export const DRY_MAX_HUMIDITY_PERCENT = 50;
export const CONTINENTAL_MAX_AVERAGE_HIGH_C = 18;
export const CONTINENTAL_MIN_ANNUAL_RAINFALL_MM = 400;
export const CONTINENTAL_MAX_ANNUAL_RAINFALL_MM = 1200;

interface ClimateRule {
  climate: Exclude<ClimateName, 'temperate'>;
  weatherNote: string;
  matches(reading: ClimateReading): boolean;
  reason(reading: ClimateReading): string;
}

const TEMPERATE_WEATHER_NOTE =
  'Mild seasons, moderate rain, and no long freeze or year-round heat.';

export const CLIMATE_RULES: readonly ClimateRule[] = [
  {
    climate: 'polar',
    weatherNote: 'Long cold seasons, frequent snow, and a short cool summer.',
    matches(reading: ClimateReading): boolean {
      return reading.averageHighC <= POLAR_MAX_AVERAGE_HIGH_C;
    },
    reason(reading: ClimateReading): string {
      return `Average high is ${formatNumber(reading.averageHighC)}°C, at or below the polar cutoff of ${POLAR_MAX_AVERAGE_HIGH_C}°C.`;
    },
  },
  {
    climate: 'tropical',
    weatherNote: 'Hot and humid, with heavy rain and little change between seasons.',
    matches(reading: ClimateReading): boolean {
      return (
        reading.averageHighC >= TROPICAL_MIN_AVERAGE_HIGH_C &&
        reading.annualRainfallMm >= TROPICAL_MIN_ANNUAL_RAINFALL_MM &&
        reading.humidityPercent >= TROPICAL_MIN_HUMIDITY_PERCENT
      );
    },
    reason(reading: ClimateReading): string {
      return `Average high is ${formatNumber(reading.averageHighC)}°C (cutoff ${TROPICAL_MIN_AVERAGE_HIGH_C}°C), yearly rain is ${formatNumber(reading.annualRainfallMm)} mm (cutoff ${TROPICAL_MIN_ANNUAL_RAINFALL_MM} mm), and humidity is ${formatNumber(reading.humidityPercent)}% (cutoff ${TROPICAL_MIN_HUMIDITY_PERCENT}%).`;
    },
  },
  {
    climate: 'dry',
    weatherNote: 'Sparse rain, strong sun, and a wide gap between day and night.',
    matches(reading: ClimateReading): boolean {
      return (
        reading.annualRainfallMm < DRY_MAX_ANNUAL_RAINFALL_MM &&
        reading.humidityPercent < DRY_MAX_HUMIDITY_PERCENT
      );
    },
    reason(reading: ClimateReading): string {
      return `Yearly rain is ${formatNumber(reading.annualRainfallMm)} mm, under ${DRY_MAX_ANNUAL_RAINFALL_MM} mm, and humidity is ${formatNumber(reading.humidityPercent)}%, under ${DRY_MAX_HUMIDITY_PERCENT}%.`;
    },
  },
  {
    climate: 'continental',
    weatherNote: 'Warm or hot summers, cold winters, and a sharp seasonal swing.',
    matches(reading: ClimateReading): boolean {
      return (
        reading.averageHighC < CONTINENTAL_MAX_AVERAGE_HIGH_C &&
        reading.annualRainfallMm >= CONTINENTAL_MIN_ANNUAL_RAINFALL_MM &&
        reading.annualRainfallMm < CONTINENTAL_MAX_ANNUAL_RAINFALL_MM
      );
    },
    reason(reading: ClimateReading): string {
      return `Average high is ${formatNumber(reading.averageHighC)}°C, under ${CONTINENTAL_MAX_AVERAGE_HIGH_C}°C, and yearly rain is ${formatNumber(reading.annualRainfallMm)} mm, from ${CONTINENTAL_MIN_ANNUAL_RAINFALL_MM} mm up to but not including ${CONTINENTAL_MAX_ANNUAL_RAINFALL_MM} mm.`;
    },
  },
];

export function classifyClimate(reading: ClimateReading): ClimateClassification {
  for (const rule of CLIMATE_RULES) {
    if (rule.matches(reading)) {
      return {
        climate: rule.climate,
        reason: rule.reason(reading),
        weatherNote: rule.weatherNote,
      };
    }
  }

  return {
    climate: 'temperate',
    reason: `Average high ${formatNumber(reading.averageHighC)}°C, yearly rain ${formatNumber(reading.annualRainfallMm)} mm, and humidity ${formatNumber(reading.humidityPercent)}% miss the polar, tropical, dry, and continental cutoffs, so the climate is temperate.`,
    weatherNote: TEMPERATE_WEATHER_NOTE,
  };
}

export function isClimateName(value: string): value is ClimateName {
  return (CLIMATE_NAMES as readonly string[]).includes(value);
}

function formatNumber(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}
