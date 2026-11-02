import { BadRequestException, Controller, Get, Header, Query } from '@nestjs/common';
import { ConvertService } from './convert.service';

@Controller()
export class ConvertController {
  constructor(private readonly convertService: ConvertService) {}

  @Get('convert')
  @Header('Content-Type', 'text/plain; charset=utf-8')
  convert(
    @Query('value') value?: string | string[],
    @Query('src') src?: string | string[],
    @Query('dst') dst?: string | string[],
  ): string {
    try {
      return `${this.convertService.format(value, src, dst)}\n`;
    } catch {
      throw new BadRequestException('Use a number and C, F, or K.');
    }
  }
}
