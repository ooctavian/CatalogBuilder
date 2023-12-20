import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from 'src/auth/token.entity';
import { Item } from 'src/items/items.entity';
import { Store } from 'src/stores/stores.entity';
import { User } from 'src/users/users.entity';
import configuration from '../configuration';

const config = configuration();
export const DatabaseModule = TypeOrmModule.forRoot({
  type: 'postgres',
  host: config.host,
  port: config.port,
  username: config.username,
  password: config.password,
  database: config.database,
  logging: true,
  // database: './database.db',
  entities: [User, Token, Item, Store],
  synchronize: true,
});
