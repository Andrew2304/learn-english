import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { HeadersDecorator } from '../../decorators/headers.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import * as ffmpeg from 'fluent-ffmpeg';
import { join } from 'path';
// import * as fs from 'fs';
import * as dayjs from 'dayjs';
import { promises as fs } from 'fs';

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

  @Post('/upload-audio')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAudio(@UploadedFile() file: any, @Body('title') title: string) {
    const fileName = `${title}-${dayjs().unix().toString()}.webm`;
    const webmPath = join(__dirname, '../../../../uploads', fileName);
    const mp3Path = webmPath.replace('.webm', '.mp3');

    // Save the uploaded file
    await fs.writeFile(webmPath, file.buffer);

    // Convert to MP3
    await new Promise((resolve, reject) => {
      ffmpeg(webmPath)
        .toFormat('mp3')
        .on('end', () => {
          resolve(null);
        })
        .on('error', (err) => {
          console.error('Conversion error', err);
          reject(err);
        })
        .save(mp3Path);
    });

    await fs.unlink(webmPath);

    return {
      message: 'File uploaded and converted',
      mp3Path: fileName.replace('.webm', '.mp3'),
    };
  }
}
