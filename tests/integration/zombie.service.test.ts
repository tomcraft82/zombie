import { EntityNotFoundError } from "typeorm";

import * as ZombieService from "../../src/modules/zombies/zombie.service";
import { Zombie } from "../../src/modules/zombies/zombie.entity";
import { TestHelper } from "./testhelper";

beforeAll(async () => {
    await TestHelper.instance.setupTestDB();
});

describe("ZombieService", () => {
    describe("create", () => {
        it("should store a zombie when valid payload is provided", async () => {
            const payload: Zombie = {
                name: "Test name",
                creation_date: new Date(),
                items: [],
            };

            const zombieCreated = await ZombieService.create(payload);
            expect(zombieCreated).not.toBeNull();
            expect(zombieCreated.name).toEqual("Test name");
            expect(zombieCreated.creation_date.toUTCString()).toEqual(
                payload.creation_date.toUTCString()
            );
        });
    });

    describe("update", () => {
        it("should update a zombie when valid payload is provided", async () => {
            const payloadCreate: Zombie = {
                name: "Test name",
                creation_date: new Date(),
                items: [],
            };

            const zombieCreated = await ZombieService.create(payloadCreate);

            const payloadUpdate: Zombie = {
                name: "Test name updated",
                creation_date: new Date(),
                items: [],
            };

            const zombieUpdated = await ZombieService.update(
                zombieCreated.id as number,
                payloadUpdate
            );

            expect(zombieUpdated.name).toEqual("Test name updated");
        });
    });

    describe("findAll", () => {
        it("should retrieve all zombies", async () => {
            const payload1: Zombie = {
                name: "Test name",
                creation_date: new Date(),
                items: [],
            };
            const payload2: Zombie = {
                name: "Test name",
                creation_date: new Date(),
                items: [],
            };

            await ZombieService.create(payload1);
            await ZombieService.create(payload2);

            const zombies: Zombie[] = await ZombieService.findAll();

            const zombie1: Zombie | undefined = zombies.find((zombie) => {
                return zombie.name === payload1.name;
            });
            const zombie2: Zombie | undefined = zombies.find((zombie) => {
                return zombie.name === payload2.name;
            });

            expect(zombie1).not.toBeUndefined();
            expect(zombie2).not.toBeUndefined();
        });
    });

    describe("findOne", () => {
        it("should retrieve a single zombie by id", async () => {
            const payload: Zombie = {
                name: "Test name",
                creation_date: new Date(),
                items: [],
            };

            const zombieCreated: Zombie = await ZombieService.create(payload);

            const zombie: Zombie = await ZombieService.find(
                zombieCreated.id as number
            );

            expect(zombie).not.toBeNull();
            expect(zombie.name).toEqual("Test name");
        });

        it("should thrown an exception when retrieve a single zombie by non-existing id", async () => {
            try {
                const zombie: Zombie = await ZombieService.find(999);
                fail("Zombie should not exist");
            } catch (error) {
                expect(error).toBeInstanceOf(EntityNotFoundError);
            }
        });
    });

    describe("remove", () => {
        it("should remove a single zombie by id", async () => {
            const payload: Zombie = {
                name: "Test name",
                creation_date: new Date(),
                items: [],
            };

            const zombieCreated: Zombie = await ZombieService.create(payload);

            await ZombieService.remove(zombieCreated.id as number);

            try {
                await ZombieService.find(
                    zombieCreated.id as number
                );
                fail("Zombie should not exist");
            } catch (error) {
                expect(error).toBeInstanceOf(EntityNotFoundError);
            }
        });
    });
});
