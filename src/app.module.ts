import { Module } from '@nestjs/common';
import { WordsModule } from './modules/words/words.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfig, DatabaseConfig } from './configs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoriesModule } from './modules/histories/histories.module';

@Module({
  imports: [
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
