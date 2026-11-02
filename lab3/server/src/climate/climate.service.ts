import { Injectable } from '@nestjs/common';
import {
  classifyClimate,
  type ClimateClassification,
  type ClimateReading,
} from './climate.rules';

@Injectable()
export class ClimateService {
  classify(reading: ClimateReading): ClimateClassification {
    return classifyClimate(reading);
  }
}
