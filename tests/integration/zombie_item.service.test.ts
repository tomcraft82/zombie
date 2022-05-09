import { EntityNotFoundError } from "typeorm";

import * as ZombieService from "../../src/modules/zombies/zombie.service";
import * as ZombieItemService from "../../src/modules/zombie_items/zombie_item.service";
import { Zombie } from "../../src/modules/zombies/zombie.entity";
import { TestHelper } from "./testhelper";
import { ZombieItem } from "../../src/modules/zombie_items/zombie_item.entity";
import { AppDataSource } from "../../src/data-source";

beforeAll(async () => {
    await TestHelper.instance.setupTestDB();
});

describe("ZombieItemService", () => {
    describe("getForZombie", () => {
        it("should retrieve all zombie items", async () => {
            const payloadZombie: Zombie = {
                name: "Zombie add test",
                creation_date: new Date(),
                items: [],
            };

            const zombieCreated = await ZombieService.create(payloadZombie);

            const payload1Item: ZombieItem = {
                name: "Item add test1",
                value_pln: 123400,
                zombie: zombieCreated,
            };

            await ZombieItemService.add(zombieCreated.id as number, payload1Item);

            const payload2Item: ZombieItem = {
                name: "Item add test2",
                value_pln: 123400,
                zombie: zombieCreated,
            };

            await ZombieItemService.add(zombieCreated.id as number, payload2Item);

            const items: ZombieItem[] = await ZombieItemService.getForZombie(zombieCreated.id as number);

            const zombie1: ZombieItem | undefined = items.find((item) => {
                return item.name === payload1Item.name;
            });
            const zombie2: ZombieItem | undefined = items.find((item) => {
                return item.name === payload2Item.name;
            });

            expect(zombie1).not.toBeUndefined();
            expect(zombie2).not.toBeUndefined();
        });
    });

    describe("add", () => {
        it("should add an item to zombie when valid payload is provided", async () => {
            const payloadZombie: Zombie = {
                name: "Zombie add test",
                creation_date: new Date(),
                items: [],
            };

            const zombieCreated = await ZombieService.create(payloadZombie);

            const payloadItem: ZombieItem = {
                name: "Item add test",
                value_pln: 123400,
                zombie: zombieCreated,
            };

            const itemCreated = await ZombieItemService.add(zombieCreated.id as number, payloadItem);

            expect(itemCreated).not.toBeNull();
            expect(itemCreated.name).toEqual("Item add test");
            expect(itemCreated.value_pln).toEqual(123400);
            expect(itemCreated.zombie.id).toEqual(zombieCreated.id);
        });
    });

    describe("update", () => {
        it("should update an item when valid payload is provided", async () => {
            const payloadZombie: Zombie = {
                name: "Zombie add test",
                creation_date: new Date(),
                items: [],
            };

            const zombieCreated = await ZombieService.create(payloadZombie);

            const payloadItemCreate: ZombieItem = {
                name: "Item add test",
                value_pln: 123400,
                zombie: zombieCreated,
            };

            const itemCreated = await ZombieItemService.add(zombieCreated.id as number, payloadItemCreate);

            const payloadItemUpdate: ZombieItem = {
                name: "Item add test updated",
                value_pln: 123456,
                zombie: zombieCreated,
            };

            const zombieItemUpdated = await ZombieItemService.update(
                itemCreated.id as number,
                payloadItemUpdate
            );

            expect(zombieItemUpdated.name).toEqual("Item add test updated");
            expect(zombieItemUpdated.value_pln).toEqual(123456);
        });
    });

    describe("remove", () => {
        it("should remove a single item from zombie by id", async () => {
            const payloadZombie: Zombie = {
                name: "Zombie add test",
                creation_date: new Date(),
                items: [],
            };

            const zombieCreated = await ZombieService.create(payloadZombie);

            const payloadItem: ZombieItem = {
                name: "Item add test",
                value_pln: 123400,
                zombie: zombieCreated,
            };

            const itemCreated = await ZombieItemService.add(zombieCreated.id as number, payloadItem);
            await ZombieItemService.remove(itemCreated.id as number);

            try {
                await AppDataSource.manager.getRepository(ZombieItem).findOneByOrFail({ id: itemCreated.id as number });
                fail("Item should not exist");
            } catch (error) {
                expect(error).toBeInstanceOf(EntityNotFoundError);
            }
        });
    });
});
