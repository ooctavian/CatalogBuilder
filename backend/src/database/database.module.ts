import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from 'src/auth/token.entity';
import { Item } from 'src/items/items.entity';
import { Store } from 'src/stores/stores.entity';
import { User } from 'src/users/users.entity';
import configuration from '../configuration';

const config = configuration();
export const DatabaseModule = TypeOrmModule.forRoot({
  type: 'postgres',
  url: config.database_url,
  logging: true,
  // database: './database.db',
  entities: [User, Token, Item, Store],
  synchronize: true,
});
