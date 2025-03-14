import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
require('dotenv').config();
const entityPath = __dirname + '/modules/**/entities/*.entity.{js,ts}';
export const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    entities: [entityPath],
    migrationsTableName: 'migration',
    migrations: ['./src/migrations/*.ts'],
    ssl: process.env.MODE == 'production',
    synchronize: false,
    migrationsRun: true
});

export const options: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.MODE == 'production'? process.env.POSTGRES_HOST: 'postgres_db',
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    autoLoadEntities: true,
    entities: [],
    migrationsTableName: 'migration',
    ssl: process.env.MODE == 'production',
    synchronize: false,
    migrationsRun: true,
    migrations: ['./dist/migrations/*.{js,ts}'],
}

/**
 * OLD
 {
      type: 'postgres',
      host: 'database',
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      entities: [],
      synchronize: false,
      migrationsRun: true,
    }
 */