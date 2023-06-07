import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { AirqualityService } from '../services/airquality.service';
import { AirQualityByLatAndLonQueryDto } from '../dto/airquality.dto';

@Controller('/api/v1/airquality')
export class AirqualityController {
  constructor(private readonly airQualityService: AirqualityService) {}

  @Get()
  getByLatLong(
    @Query(new ValidationPipe({ transform: true }))
    query: AirQualityByLatAndLonQueryDto,
  ) {
    return this.airQualityService.getPollutionByLatLon(query.lat, query.lon);
  }
  @Get('/paris')
  getParisMostPolluted() {
    return this.airQualityService.getWhenParisIsMostPolluted();
  }
}
