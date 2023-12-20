import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from '../stores/stores.entity';
import { User } from '../users/users.entity';
import { Item } from './items.entity';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  providers: [ItemsService],
  controllers: [ItemsController],
  imports: [
    HttpModule,
    DatabaseModule,
    ConfigModule,
    TypeOrmModule.forFeature([Store, User, Item]),
  ],
})
export class ItemsModule {}
