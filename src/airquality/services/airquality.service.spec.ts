import { Test, TestingModule } from '@nestjs/testing';
import { AirqualityService } from './airquality.service';
import { AppService } from '../../app.service';
import { ConfigService } from '@nestjs/config';
import { ApiClient } from '../api-client/api-client';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AirQuality } from '../entities/airQuality.entity';
import { Repository } from 'typeorm';
import { IqAirByLatAndLonResponseDto } from '../dto/airquality.dto';
import { HttpException } from '@nestjs/common';

jest.mock('../api-client/api-client');

describe('AirqualityService', () => {
  let service: AirqualityService;
  let apiClient: ApiClient;
  const fakeRepo: Partial<Repository<AirQuality>> = {
    findOneBy: jest.fn().mockResolvedValue(null),
    save: jest.fn().mockResolvedValue(null),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirqualityService,
        AppService,
        ConfigService,
        ApiClient,
        {
          provide: getRepositoryToken(AirQuality),
          useValue: fakeRepo,
        },
      ],
    }).compile();

    service = module.get<AirqualityService>(AirqualityService);
    apiClient = module.get<ApiClient>(ApiClient);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('the getPollutionByLatLon() method', () => {
    it('should return empty pollution object because the api did not return anything', async () => {
      const getSpy = jest
        .spyOn(apiClient, 'get')
        .mockResolvedValue({ response: { data: {} } });
      const result = await service.getPollutionByLatLon('22', '90');
      expect(getSpy).toBeCalledWith('/nearest_city?lat=22&lon=90');
      expect(result).toMatchObject({ pollution: {} });
    });
    it('should return empty pollution object with data filled', async () => {
      const mockedReslovedResponse = {
        data: {
          data: {
            current: {
              pollution: {
                ts: '2023-06-07T09:00:00.000Z',
                aqius: 110,
                mainus: 'p2',
                aqicn: 55,
                maincn: 'p2',
              },
            },
          },
        },
      };
      const mockedAirQuailtyValue = new IqAirByLatAndLonResponseDto({
        ts: '2023-06-07T09:00:00.000Z',
        aqius: 110,
        mainus: 'p2',
        aqicn: 55,
        maincn: 'p2',
      });
      const getSpy = jest
        .spyOn(apiClient, 'get')
        .mockResolvedValue(mockedReslovedResponse);
      const result = await service.getPollutionByLatLon('22', '90');
      expect(getSpy).toBeCalledWith('/nearest_city?lat=22&lon=90');
      expect(result).toMatchObject({ pollution: mockedAirQuailtyValue });
    });
    it('should throw http error if the api failed', async () => {
      jest.spyOn(apiClient, 'get').mockRejectedValue('error');
      await expect(service.getPollutionByLatLon('22', '90s')).rejects.toThrow(
        HttpException,
      );
    });
  });
});
