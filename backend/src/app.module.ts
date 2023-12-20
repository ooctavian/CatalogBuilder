import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { Token } from './auth/token.entity';
import { ItemsModule } from './items/items.module';
import { StoresModule } from './stores/stores.module';
import { Store } from './stores/stores.entity';
import { Item } from './items/items.entity';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ItemsModule,
    StoresModule,
    DatabaseModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forFeature([User, Token, Store, Item], {
      type: 'sqlite',
      database: 'database.db',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
