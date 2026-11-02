import { Transform } from 'class-transformer';
import { registerDecorator, type ValidationOptions } from 'class-validator';

export const AVERAGE_HIGH_MIN_C = -80;
export const AVERAGE_HIGH_MAX_C = 55;
export const ANNUAL_RAINFALL_MIN_MM = 0;
export const ANNUAL_RAINFALL_MAX_MM = 12000;
export const HUMIDITY_MIN_PERCENT = 0;
export const HUMIDITY_MAX_PERCENT = 100;

const averageHighMessage = `highC must be a number from ${AVERAGE_HIGH_MIN_C} to ${AVERAGE_HIGH_MAX_C}.`;
const rainfallMessage = `rainfallMm must be a number from ${ANNUAL_RAINFALL_MIN_MM} to ${ANNUAL_RAINFALL_MAX_MM}.`;
const humidityMessage = `humidity must be a number from ${HUMIDITY_MIN_PERCENT} to ${HUMIDITY_MAX_PERCENT}.`;

function toRequiredNumber(value: unknown): unknown {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') {
      return value;
    }
    return Number(trimmed);
  }
  return value;
}

function IsBoundedNumber(min: number, max: number, message: string, validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      name: 'isBoundedNumber',
      target: object.constructor,
      propertyName,
      constraints: [min, max],
      options: { ...validationOptions, message },
      validator: {
        validate(value: unknown): boolean {
          return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
        },
      },
    });
  };
}

export class ClassifyDto {
  @Transform(({ value }) => toRequiredNumber(value))
  @IsBoundedNumber(AVERAGE_HIGH_MIN_C, AVERAGE_HIGH_MAX_C, averageHighMessage)
  highC!: number;

  @Transform(({ value }) => toRequiredNumber(value))
  @IsBoundedNumber(ANNUAL_RAINFALL_MIN_MM, ANNUAL_RAINFALL_MAX_MM, rainfallMessage)
  rainfallMm!: number;

  @Transform(({ value }) => toRequiredNumber(value))
  @IsBoundedNumber(HUMIDITY_MIN_PERCENT, HUMIDITY_MAX_PERCENT, humidityMessage)
  humidity!: number;
}
