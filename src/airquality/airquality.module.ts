import { Module } from '@nestjs/common';
import { AirqualityController } from './controllers/airquality.controller';
import { AirqualityService } from './services/airquality.service';
import { HttpModule } from '@nestjs/axios';
import { AppService } from '../app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks/tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirQuality } from './entities/airQuality.entity';
import { CacheService } from './services/cache.service';
import { ApiClient } from './api-client/api-client';

@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([AirQuality]),
  ],
  controllers: [AirqualityController],
  providers: [
    AirqualityService,
    AppService,
    TasksService,
    CacheService,
    ApiClient,
  ],
})
export class AirqualityModule {}
