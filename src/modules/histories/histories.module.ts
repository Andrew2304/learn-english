import { Module } from '@nestjs/common';
import { HistoriesService } from './histories.service';
import { HistoriesController } from './histories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from './entities/history.entity';
import { HistoryDetail } from './entities/history-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([History]), TypeOrmModule.forFeature([HistoryDetail])],
  controllers: [HistoriesController],
  providers: [HistoriesService],
})
export class HistoriesModule {}
