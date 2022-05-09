/**
 * Required External Modules
 */

import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import "reflect-metadata";

import { AppDataSource } from "./data-source";
import { zombiesRouter } from "./modules/zombies/zombie.router";
import { zombieItemsRouter } from "./modules/zombie_items/zombie_item.router";
import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";

dotenv.config();

/**
 * App Variables
 */

if (!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

AppDataSource.initialize()
    .then(async () => {
        const app = express();

        /**
         *  App Configuration
         */

        app.use(helmet());
        app.use(cors());
        app.use(express.json());
        app.use("/api/v1/zombies", zombieItemsRouter);
        app.use("/api/v1/zombies", zombiesRouter);
        app.use(errorHandler);
        app.use(notFoundHandler);

        /**
         * Server Activation
         */

        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);
        });
    })
    .catch((error) => console.log("DB connection error: ", error));
