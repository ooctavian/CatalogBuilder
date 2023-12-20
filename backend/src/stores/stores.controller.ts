import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto, UpdateStoreDto } from './stores.dto';
import { Authorization } from '../auth/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  create(@Body() store: CreateStoreDto, @Authorization() user: string) {
    return this.storesService.save(user, store);
  }

  @Patch('/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  update(
    @Body() store: UpdateStoreDto,
    @Param() { id }: { id: string },
    @Authorization() user: string,
  ) {
    return this.storesService.update(user, id, store);
  }

  @Get('/:id')
  read(@Param() params: { id: string }) {
    return this.storesService.find(params.id);
  }

  @Get('/')
  readByUser(@Authorization() user: string) {
    return this.storesService.findStoresByUser(user);
  }

  @Delete('/:id')
  delete(@Authorization() user: string, @Param() params: { id: string }) {
    return this.storesService.delete(params.id, user);
  }

  @Post('/:id/cover')
  @UseInterceptors(FileInterceptor('cover'))
  uploadCover(
    @Authorization() userId: string,
    @Param() { id: storeId }: { id: string },
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: '^image/(jpeg|png)$',
        })
        .addMaxSizeValidator({
          maxSize: 1000000,
        })
        .build({
          exceptionFactory(error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
          },
        }),
    )
    file: Express.Multer.File,
  ) {
    return this.storesService.uploadCover(userId, storeId, file);
  }
}
