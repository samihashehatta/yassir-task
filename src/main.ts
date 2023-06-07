import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { createConnection, getManager } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
dotenv.config();

// only to create the data base
const CreateDBIfNotExists = async (
  options: TypeOrmModuleOptions,
): Promise<void> => {
  const connection = await createConnection(options as MysqlConnectionOptions);

  const manager = getManager();
  await manager.query(
    'CREATE DATABASE IF NOT EXISTS yassir DEFAULT CHARSET=utf8;',
  );

  await connection.close();
};
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  await CreateDBIfNotExists({
    type: 'mysql',
    host: process.env.TYPEORM_HOST,
    port: Number(process.env.TYPEORM_PORT),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    synchronize: false,
  });
  // Add swagger
  const options = new DocumentBuilder()
    .setTitle('Yassir')
    .setVersion('1.0')
    .addTag('')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document, {});

  await app.listen(process.env.SERVER_PORT || 8080, () => {
    console.log(`Listening on PORT ${process.env.SERVER_PORT}`);
  });
}
bootstrap();
