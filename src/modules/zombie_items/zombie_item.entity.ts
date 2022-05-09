import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Zombie } from "../zombies/zombie.entity";

@Entity()
export class ZombieItem {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    name!: string;

    @Column()
    value_pln?: number; //includes 2 decimal places

    @ManyToOne(() => Zombie, (zombie) => zombie.id)
    zombie!: Zombie
}
