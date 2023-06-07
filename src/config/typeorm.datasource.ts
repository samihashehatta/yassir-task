import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { AirQuality } from '../airquality/entities/airQuality.entity';
import { AirQuality1686080203573 } from '../migration/1686080203573-AirQuality';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'mysql',
  host: configService.get('TYPEORM_HOST'),
  port: configService.get('TYPEORM_PORT)'),
  username: configService.get('TYPEORM_USERNAME'),
  password: configService.get('TYPEORM_PASSWORD'),
  database: configService.get('TYPEORM_DATABASE'),
  entities: [AirQuality],
  migrations: [AirQuality1686080203573],
  synchronize: false,
  migrationsRun: false,
});
