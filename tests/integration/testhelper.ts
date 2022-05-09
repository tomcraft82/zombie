import { AppDataSource } from "../../src/data-source";

export class TestHelper {

    private static _instance: TestHelper;

    private constructor() {}

    public static get instance(): TestHelper {
        if(!this._instance) this._instance = new TestHelper();

        return this._instance;
    }

    async setupTestDB() {
        await AppDataSource.initialize();
    }

    async teardownTestDB() {
        await AppDataSource.destroy();
    }
}