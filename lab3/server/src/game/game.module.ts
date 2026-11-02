import { Module } from '@nestjs/common';
import { CitiesModule } from '../cities/cities.module';
import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
  imports: [CitiesModule],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
