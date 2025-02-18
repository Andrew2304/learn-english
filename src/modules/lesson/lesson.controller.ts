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
import { CreateLessonDto, CreateSampleDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { HeadersDecorator } from '../../decorators/headers.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import * as ffmpeg from 'fluent-ffmpeg';
import { join } from 'path';
// import * as fs from 'fs';
import * as dayjs from 'dayjs';
import { promises as fs } from 'fs';
import * as gtts from 'gtts';
import axios from 'axios';

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
  async uploadAudio(
    @UploadedFile() file: any,
    @Body('title') title: string,
    @HeadersDecorator('user-id') userId: number,
  ) {
    if (!userId) return null;

    const fileName = `${userId}-${title}-${dayjs().unix().toString()}.webm`;
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

  @Post('/sample-audio')
  async convertTextToSpeech(
    @Body() input: CreateSampleDto,
    @HeadersDecorator('user-id') userId: number,
  ): Promise<string> {
    if (!userId) return null;

    const fileName = `${userId}-${input.text}.mp3`;

    const tts = new gtts(input.text, 'en');
    const filePath = join(__dirname, '../../../../uploads/sample', fileName);

    return new Promise((resolve, reject) => {
      tts.save(filePath, (err) => {
        if (err) {
          reject('Error generating speech');
        }
        resolve(`/sample/${fileName}`);
      });
    });
  }

  @Post('/check-grammar')
  async checkGrammar(
    @Body() input: CreateSampleDto,
    @HeadersDecorator('user-id') userId: number,
  ) {
    try {
      const response = await axios.post(
        'https://api.languagetool.org/v2/check',
        null,
        {
          params: {
            text: input.text,
            language: 'en-US',
          },
        },
      );

      if (response.data.matches.length > 0) {
        console.log('Errors found:', response.data.matches);
        response.data.matches.forEach((match, index) => {
          console.log(`${index + 1}. ${match.message}`);
          console.log(
            `   Suggestion: ${match.replacements.map((r) => r.value).join(', ')}`,
          );
        });
      } else {
        console.log('No grammar mistakes found! ✅');
      }
    } catch (error) {
      console.error('Error checking grammar:', error.message);
    }
  }
}
