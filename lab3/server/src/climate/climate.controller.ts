import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ClassifyDto } from './classify.dto';
import { ClimateService } from './climate.service';

@Controller()
export class ClimateController {
  constructor(private readonly climateService: ClimateService) {}

  @Post('classify')
  @HttpCode(200)
  classify(@Body() body: ClassifyDto) {
    return this.climateService.classify(body);
  }
}
