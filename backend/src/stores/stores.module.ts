import { Module } from '@nestjs/common';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './stores.entity';
import { User } from '../users/users.entity';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [StoresController],
  providers: [StoresService],
  imports: [
    DatabaseModule,
    HttpModule,
    ConfigModule,
    TypeOrmModule.forFeature([Store, User]),
  ],
})
export class StoresModule {}
