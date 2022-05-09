import { AppDataSource } from "../../data-source";
import { Zombie } from "../zombies/zombie.entity";
import { ZombieItem } from "./zombie_item.entity";
import * as dotenv from "dotenv";

dotenv.config();

export const getForZombie = async (zombieId: number): Promise<ZombieItem[]> => {
    const zombieFound = await AppDataSource.manager.getRepository(Zombie).findOneByOrFail({ id: zombieId });
    const zombieItems = await AppDataSource.manager.getRepository(ZombieItem).find({
        where: {
            zombie: zombieFound,
        },
    });

    return zombieItems;
};

export const add = async (zombieId: number, payload: ZombieItem): Promise<ZombieItem> => {
    const zombieItemRepository = AppDataSource.manager.getRepository(ZombieItem);

    payload.zombie = await AppDataSource.manager.getRepository(Zombie).findOneByOrFail({ id: zombieId });
    const canAddMore = await canAddItem(payload.zombie);
    
    if (!canAddMore) {
        throw new Error('Cannot add more items!');
    }
    
    const zombieItem = zombieItemRepository.create(payload);
    await zombieItemRepository.save(zombieItem);

    return zombieItem;
};

export const update = async (id: number, zombieItemToUpdate: ZombieItem): Promise<ZombieItem> => {
    const zombieItemRepository = AppDataSource.manager.getRepository(ZombieItem);
    const zombieItem = await zombieItemRepository.findOneByOrFail({ id: id });
    mapAttributes(zombieItem, zombieItemToUpdate);

    const updatedZombieItem = await zombieItemRepository.save(zombieItem);

    return updatedZombieItem;
};

export const remove = async (id: number): Promise<null | void> => {
    const zombieItemRepository = AppDataSource.manager.getRepository(ZombieItem);
    await zombieItemRepository.findOneByOrFail({ id: id });
    await zombieItemRepository.delete(id);
};

const canAddItem = async (zombie: Zombie): Promise<boolean> => {
    const itemsOwned = await AppDataSource.manager.getRepository(ZombieItem).count({where: {zombie: zombie}});
    const maxItems: number = process.env.ZOMBIE_MAX_ITEMS !== undefined ? parseInt(process.env.ZOMBIE_MAX_ITEMS, 10) : 5;

    return itemsOwned < maxItems;
}

const mapAttributes = (subject: ZombieItem, mapped: ZombieItem): ZombieItem => {
    subject.name = mapped.name;
    subject.value_pln = mapped.value_pln;

    return subject;
};