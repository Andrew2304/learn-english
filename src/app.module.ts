import { Module } from '@nestjs/common';
import { WordsModule } from './modules/words/words.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfig, DatabaseConfig } from './configs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoriesModule } from './modules/histories/histories.module';
import { LessonModule } from './modules/lesson/lesson.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'uploads'), // Path to your uploads folder
      serveRoot: '/files', // Base URL to access files
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [AppConfig, DatabaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
      inject: [ConfigService],
    }),
    WordsModule,
    HistoriesModule,
    LessonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
