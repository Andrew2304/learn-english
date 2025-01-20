import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { HeadersDecorator } from '../../decorators/headers.decorator';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  create(
    @Body() createLessonDto: CreateLessonDto,
    @HeadersDecorator('user-id') userId: number,
  ) {
    if (!userId) return null;
    return this.lessonService.create(createLessonDto, userId);
  }

  @Get()
  findAll(@HeadersDecorator('user-id') userId: number) {
    if (!userId) return null;
    return this.lessonService.findAll(userId);
  }

  @Get('/topics')
  findTopics(@HeadersDecorator('user-id') userId: number) {
    if (!userId) return null;
    return this.lessonService.findTopics(userId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @HeadersDecorator('user-id') userId: number,
  ) {
    if (!userId) return null;
    return this.lessonService.findOne(+id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLessonDto: CreateLessonDto,
    @HeadersDecorator('user-id') userId: number,
  ) {
    if (!userId) return null;
    return this.lessonService.update(+id, updateLessonDto, userId);
  }

  @Patch(':id/questions')
  updateQuestions(
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
    @HeadersDecorator('user-id') userId: number,
  ) {
    if (!userId) return null;
    return this.lessonService.updateQuestions(+id, updateLessonDto, userId);
  }
}
