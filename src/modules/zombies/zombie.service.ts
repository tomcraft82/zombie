import { AppDataSource } from "../../data-source";
import { Zombie } from "./zombie.entity";

export const findAll = async (): Promise<Zombie[]> => {
    const zombies = await AppDataSource.manager.getRepository(Zombie).find();

    return zombies;
};

export const find = async (id: number): Promise<Zombie> => {
    const zombie = await AppDataSource.manager.getRepository(Zombie).findOneByOrFail({ id: id });

    return zombie;
};

export const create = async (payload: Zombie): Promise<Zombie> => {
    const zombieRepository = AppDataSource.manager.getRepository(Zombie);
    payload.creation_date = new Date();
    const zombie = zombieRepository.create(payload);

    await zombieRepository.save(zombie);

    return zombie;
};

export const update = async (id: number,zombieToUpdate: Zombie): Promise<Zombie> => {
    const zombie = await find(id);
    mapAttributes(zombie, zombieToUpdate);

    const updatedZombie = await AppDataSource.manager.getRepository(Zombie).save(zombie);

    return updatedZombie;
};

export const remove = async (id: number): Promise<null | void> => {
    await find(id);
    await AppDataSource.manager.getRepository(Zombie).delete(id);
};

const mapAttributes = (subject: Zombie, mapped: Zombie): Zombie => {
    subject.name = mapped.name;
    subject.creation_date = mapped.creation_date;

    return subject;
};
