import { Module } from '@nestjs/common';
import { ClimateModule } from './climate/climate.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [ClimateModule, GameModule],
})
export class AppModule {}
