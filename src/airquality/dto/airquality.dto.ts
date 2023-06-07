import { ApiProperty } from '@nestjs/swagger';
import { IsLatitude, IsLongitude } from 'class-validator';

export class AirQualityByLatAndLonQueryDto {
  @ApiProperty()
  @IsLatitude()
  public lat: string;

  @ApiProperty()
  @IsLongitude()
  public lon: string;
}

export class IqAirByLatAndLonResponseDto {
  public ts: string;
  public aqius: number;
  public aqicn: number;
  public maincn: string;
  public mainus: string;
  constructor(data) {
    Object.assign(this, data);
  }
}
export type AirQualityByLatAndLonResponseDto = {
  pollution: IqAirByLatAndLonResponseDto;
};
