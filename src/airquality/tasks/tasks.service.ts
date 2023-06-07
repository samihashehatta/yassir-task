import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AirqualityService } from '../services/airquality.service';
import { CacheService } from '../services/cache.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    private readonly airQualityService: AirqualityService,
    private readonly cacheService: CacheService,
  ) {}

  @Cron('*/1 * * * *')
  async handleCron() {
    this.logger.debug('Running every minute but will save every hour');
    // check if we still have the last date we called
    const lastDateSaved = await this.cacheService.get('paris:pollution:last');
    console.log('ee', lastDateSaved);
    if (!lastDateSaved) {
      const data = await this.airQualityService.getPollutionByLatLon(
        '48.856613',
        '2.352222',
      );
      await this.airQualityService.saveParisData(data.pollution);
      // overwrite with the new value
      await this.cacheService.set(
        'paris:pollution:last',
        data.pollution.ts,
        3600,
      );
    }
  }
}
