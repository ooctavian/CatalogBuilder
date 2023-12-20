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
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { Authorization } from '../auth/auth.decorator';
import { CreateItemDto, UpdateItemDto } from './items.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller()
export class ItemsController {
  constructor(private readonly itemService: ItemsService) {}
  @Post('stores/:storeId/items')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  create(
    @Authorization() userId: string,
    @Body() item: CreateItemDto,
    @Param() params: { storeId: string },
  ) {
    return this.itemService.save(userId, params.storeId, item);
  }

  @Patch('/stores/:storeId/items/:itemId')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  update(
    @Authorization() userId: string,
    @Body() item: UpdateItemDto,
    @Param() params: { storeId: string; itemId: string },
  ) {
    return this.itemService.update(userId, params.storeId, params.itemId, item);
  }

  @Get('stores/:storeId/items')
  get(@Param() params: { storeId: string }) {
    return this.itemService.findByStore(params.storeId);
  }

  @Delete('stores/:storeId/items/:itemId')
  delete(
    @Authorization() userId: string,
    @Param() params: { storeId: string; itemId: string },
  ) {
    this.itemService.delete(userId, params.storeId, params.itemId);
  }

  @Post('stores/:storeId/items/:itemId/images')
  @UseInterceptors(FilesInterceptor('images', 4))
  async uploadCover(
    @Authorization() userId: string,
    @Param() { storeId, itemId }: { storeId: string; itemId: string },
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image/jpeg' || 'image/png',
        })
        .addMaxSizeValidator({
          maxSize: 1000000, // just to you know it's possible.
        })
        .build({
          exceptionFactory(error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
          },
        }),
    )
    images: Array<Express.Multer.File>,
  ) {
    return this.itemService.uploadImages(userId, storeId, itemId, images);
  }

  @Delete('stores/:storeId/items/:itemId/images/:coverId')
  async deleteCover(
    @Authorization() userId: string,
    @Param()
    {
      storeId,
      itemId,
      coverId,
    }: { storeId: string; itemId: string; coverId: number },
  ) {
    return this.itemService.deleteImage(userId, storeId, itemId, coverId);
  }
}
