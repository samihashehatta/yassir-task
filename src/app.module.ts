import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirqualityModule } from './airquality/airquality.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AirQuality } from './airquality/entities/airQuality.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@liaoliaots/nestjs-redis';
// import DBConfig from './configs/config';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.TYPEORM_HOST,
      port: Number(process.env.TYPEORM_PORT),
      database: process.env.TYPEORM_DATABASE,
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      entities: [AirQuality],
      synchronize: false,
      migrationsRun: true,
      migrations: ['dist/migrations/*.js'],
    }),
    RedisModule.forRoot({
      config: {
        namespace: process.env.REDIS_NAME,
        name: process.env.REDIS_NAME,
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
        tls: process.env.REDIS_USE_TLS === 'true' ? {} : null,
        keyPrefix: process.env.REDIS_KEYPREFIX,
      },
    }),
    AirqualityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
