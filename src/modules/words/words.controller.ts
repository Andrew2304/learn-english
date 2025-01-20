import { Controller, Get, Query } from '@nestjs/common';
import { join } from 'path';
import { HeadersDecorator } from '../../decorators/headers.decorator';
import { WordsService } from './words.service';

@Controller('words')
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  // @Post()
  // create(@Body() createWordDto: CreateWordDto) {
  //   return this.wordsService.create(createWordDto);
  // }

  @Get()
  findAll(
    @Query() { take, skip, wordType },
    @HeadersDecorator('user-id') userId: number,
  ) {
    if (!userId) return null;
    return this.wordsService.findAll(take, skip, userId, wordType);
  }

  @Get('/sync-csv')
  readCSV() {
    const filePath = join(
      __dirname,
      '../..',
      'assets/assets/Level-A1-vocabulary-wordlist.csv',
    );

    return this.wordsService.handCsv(filePath);
  }

  @Get('/sync-sound')
  syncSound() {
    return this.wordsService.syncSound();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.wordsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateWordDto: UpdateWordDto) {
  //   return this.wordsService.update(+id, updateWordDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.wordsService.remove(+id);
  // }
}
