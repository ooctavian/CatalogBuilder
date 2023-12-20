import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Item } from './items.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateItemDto, UpdateItemDto } from './items.dto';
import { Store } from '../stores/stores.entity';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios/index';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async save(userId: string, storeId: string, item: CreateItemDto) {
    const store = await this.storeRepository.findOneBy({
      uuid: storeId,
      user: {
        uuid: userId,
      },
    });
    if (!store) {
      throw NotFoundException;
    }
    return await this.itemRepository.save({
      name: item.name,
      description: item.description,
      price: item.price,
      url: item.url,
      store: store,
    });
  }

  async update(
    userId: string,
    storeId: string,
    itemId: string,
    item: UpdateItemDto,
  ) {
    const store = await this.storeRepository.findOneBy({
      uuid: storeId,
      user: {
        uuid: userId,
      },
    });
    if (!store) {
      throw new NotFoundException();
    }
    await this.itemRepository.update(itemId, {
      name: item.name,
      description: item.description,
      price: item.price,
      url: item.url,
      store: store,
    });
  }

  findByStore(storeId: string) {
    return this.itemRepository.findBy({
      store: {
        uuid: storeId,
      },
    });
  }

  async delete(userId: string, storeId: string, itemId: string) {
    const store = await this.storeRepository.findOneBy({
      uuid: storeId,
      user: {
        uuid: userId,
      },
    });
    if (!store) {
      throw NotFoundException;
    }
    await this.itemRepository.delete({
      uuid: itemId,
      store: {
        uuid: storeId,
      },
    });
  }

  async uploadImages(
    userId: string,
    storeId: string,
    itemId: string,
    images: Array<Express.Multer.File>,
  ) {
    const store = await this.storeRepository.findOneBy({
      uuid: storeId,
      user: {
        uuid: userId,
      },
    });
    if (!store) {
      throw new NotFoundException();
    }
    const item = await this.itemRepository.findOneBy({
      uuid: itemId,
      store: {
        uuid: storeId,
      },
    });
    if (!item) {
      throw new NotFoundException();
    }
    if (!item.imageUrls) {
      item.imageUrls = [];
    }
    if ((item.imageUrls.length || 0 + images.length || 0) > 4) {
      throw new Error('Exceeding image limit');
    }
    for (const image of images) {
      const formData = new FormData();
      formData.append('image', image.buffer.toString('base64'));
      const { data: imageData } = await firstValueFrom(
        this.httpService
          .post(
            `https://api.imgbb.com/1/upload?key=${this.configService.get(
              'imgbbKey',
            )}`,
            formData,
          )
          .pipe(
            catchError((error: AxiosError) => {
              throw error;
            }),
          ),
      );
      item.imageUrls.push(imageData.data.url);
    }
    await this.itemRepository.save(item);
  }

  async deleteImage(
    userId: string,
    storeId: string,
    itemId: string,
    coverId: number,
  ) {
    const store = await this.storeRepository.findOneBy({
      uuid: storeId,
      user: {
        uuid: userId,
      },
    });
    if (!store) {
      throw new NotFoundException();
    }
    const item = await this.itemRepository.findOneBy({
      uuid: itemId,
      store: {
        uuid: storeId,
      },
    });

    if (!item) {
      throw new NotFoundException();
    }

    if (!item.imageUrls || typeof item.imageUrls[coverId] === 'undefined') {
      throw new Error('Unexistent image.');
    }

    item.imageUrls.splice(coverId, 1);

    await this.itemRepository.save(item);
  }
}
