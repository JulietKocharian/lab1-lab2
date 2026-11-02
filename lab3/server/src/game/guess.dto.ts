import { Transform } from 'class-transformer';
import { IsIn, IsString, Matches } from 'class-validator';
import { CLIMATE_NAMES, type ClimateName } from '../climate/climate.rules';

const climateMessage = 'Climate must be tropical, dry, temperate, continental, or polar.';
const roundMessage = 'A round id from Start round is required.';

export class GuessDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: roundMessage })
  @Matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i, {
    message: roundMessage,
  })
  roundId!: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsString({ message: climateMessage })
  @IsIn(CLIMATE_NAMES, { message: climateMessage })
  climate!: ClimateName;
}
