import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Store } from './stores.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStoreDto, UpdateStoreDto } from './stores.dto';
import { diskStorage } from 'multer';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  findStoresByUser(userId: string): Promise<Store[]> {
    return this.storeRepository.findBy({
      user: {
        uuid: userId,
      },
    });
  }

  find(storeId: string): Promise<Store> {
    return this.storeRepository.findOneBy({
      uuid: storeId,
    });
  }

  async save(userId: string, store: CreateStoreDto) {
    const result = await this.storeRepository.save({
      name: store.name,
      description: store.description,
      user: {
        uuid: userId,
      },
    });
    delete result.user;
    return result;
  }

  async update(userId: string, storeId: string, updatedData: UpdateStoreDto) {
    const store = await this.storeRepository.findOneBy({
      uuid: storeId,
      user: {
        uuid: userId,
      },
    });
    if (!store) {
      throw new NotFoundException();
    }
    return this.storeRepository.update(storeId, {
      name: updatedData.name,
      description: updatedData.description,
    });
  }

  async delete(storeId: string, userId: string) {
    await this.storeRepository.delete({
      uuid: storeId,
      user: {
        uuid: userId,
      },
    });
  }

  async uploadCover(
    userId: string,
    storeId: string,
    file: Express.Multer.File,
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
    const formData = new FormData();
    formData.append('image', file.buffer.toString('base64'));
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
    await this.storeRepository.update(store.uuid, {
      coverUrl: imageData.data.url,
    });
    return {
      coverUrl: imageData.data.url,
    };
  }
}
