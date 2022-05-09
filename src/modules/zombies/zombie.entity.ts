import { Column, Entity, PrimaryGeneratedColumn, OneToMany,
  JoinColumn, } from "typeorm";
import { ZombieItem } from "../zombie_items/zombie_item.entity";

@Entity()
export class Zombie {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name!: string;

    @Column()
    creation_date!: Date;

    @OneToMany(() => ZombieItem, (item) => item.id)
    items!: ZombieItem[]
}
