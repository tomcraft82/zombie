import "reflect-metadata"
import * as dotenv from "dotenv";
import { DataSource } from "typeorm";
import { Zombie } from "./modules/zombies/zombie.entity";
import { ZombieItem } from "./modules/zombie_items/zombie_item.entity";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as number | undefined,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.NODE_ENV === 'test' ? process.env.DB_DATABASE_TEST : process.env.DB_DATABASE,
  synchronize: true,
  logging: true,
  entities: [Zombie, ZombieItem],
  subscribers: [],
  migrations: [],
})