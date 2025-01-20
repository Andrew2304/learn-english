import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { HeadersDecorator } from '../../decorators/headers.decorator';
import { CreateHistoryDto } from './dto/create-history.dto';
import { HistoriesService } from './histories.service';

@Controller('histories')
export class HistoriesController {
  constructor(private readonly historiesService: HistoriesService) {}

  @Post()
  create(
    @Body() createHistoryDto: CreateHistoryDto,
    @HeadersDecorator('user-id') userId: number,
  ) {
    if (!userId) return null;
    return this.historiesService.create(createHistoryDto, userId);
  }

  @Get()
  summary(
    @Query() { take, skip },
    @HeadersDecorator('user-id') userId: number,
  ) {
    if (!userId) return null;
    return this.historiesService.summary(take, skip, userId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.historiesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateHistoryDto: UpdateHistoryDto) {
  //   return this.historiesService.update(+id, updateHistoryDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.historiesService.remove(+id);
  // }
}
