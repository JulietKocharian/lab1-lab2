import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { GameService } from './game.service';
import { GuessDto } from './guess.dto';

@Controller()
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('health')
  health(): { status: 'ok' } {
    return { status: 'ok' };
  }

  @Post('rounds')
  @HttpCode(200)
  startRound() {
    return this.gameService.startRound();
  }

  @Post('guess')
  @HttpCode(200)
  guess(@Body() body: GuessDto) {
    return this.gameService.guess(body.roundId, body.climate);
  }

  @Get('score')
  score() {
    return this.gameService.score();
  }
}
