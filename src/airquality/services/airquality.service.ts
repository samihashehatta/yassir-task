import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from '../../app.service';
import { AirQuality } from '../entities/airQuality.entity';
import { ApiClient } from '../api-client/api-client';
import {
  AirQualityByLatAndLonResponseDto,
  IqAirByLatAndLonResponseDto,
} from '../dto/airquality.dto';
import { Repository, MoreThan } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AirqualityService {
  private iqairKey: string;

  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    private readonly apiClient: ApiClient,
    @InjectRepository(AirQuality)
    private readonly airQualityRepository: Repository<AirQuality>,
  ) {
    this.apiClient._host = this.configService.get<string>('AIRQUALITY_URL');
    this.iqairKey = this.configService.get<string>('AIRQUALITY_API_KEY');
  }
  async getPollutionByLatLon(
    lat: string,
    lon: string,
  ): Promise<AirQualityByLatAndLonResponseDto> {
    const url = this.appService.appendQueriesToUrl(
      { lat, lon, key: this.iqairKey },
      '/nearest_city',
    );
    try {
      const response = await this.apiClient.get(url);

      return {
        pollution: new IqAirByLatAndLonResponseDto(
          response.data?.data?.current?.pollution,
        ),
      };
    } catch (error) {
      throw new HttpException(
        error.response?.data || error.message,
        error.response?.status || 400,
      );
    }
  }

  async saveParisData(data: IqAirByLatAndLonResponseDto) {
    const parisData = new AirQuality();
    parisData.timestamp = new Date(data.ts);
    parisData.aqius = data.aqius;
    parisData.aqicn = data.aqicn;
    parisData.city = 'paris';
    const [date, time] = data.ts.split('T');
    parisData.date = date;
    const timeExtracted = time.split('.000Z');
    parisData.time = timeExtracted[0];
    return await parisData.save();
  }
  async getWhenParisIsMostPolluted() {
    const data = await this.airQualityRepository.findOne({
      where: { aqius: MoreThan(100) },
      order: { aqius: 'DESC' },
    });
    return { date: data?.date, time: data?.time };
  }
}
