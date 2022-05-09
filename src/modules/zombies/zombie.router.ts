/**
 * Required External Modules and Interfaces
 */

import express, { Request, Response } from "express";
import * as ZombieService from "./zombie.service";
import { Zombie } from "./zombie.entity";

/**
 * Router Definition
 */

export const zombiesRouter = express.Router();

/**
 * Controller Definitions
 */

// GET zombies

zombiesRouter.get("/", async (req: Request, res: Response) => {
  try {
    const zombies: Zombie[] = await ZombieService.findAll();

    res.status(200).send(zombies);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// GET zombies/:id

zombiesRouter.get("/:id", async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);

  try {
    const zombie: Zombie = await ZombieService.find(id);

    if (zombie) {
      return res.status(200).send(zombie);
    }

    res.status(404).send("zombie not found");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// POST zombies

zombiesRouter.post("/", async (req: Request, res: Response) => {
  try {
    const zombie: Zombie = req.body;
    console.log('zombie', zombie);

    const newZombie = await ZombieService.create(zombie);

    res.status(201).json(newZombie);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// PUT zombies/:id

zombiesRouter.put("/:id", async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);

  try {
    const zombieToUpdate: Zombie = req.body;

    const updatedZombie = await ZombieService.update(id, zombieToUpdate);
    return res.status(200).json(updatedZombie);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// DELETE zombies/:id

zombiesRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    await ZombieService.remove(id);

    res.sendStatus(204);
  } catch (e) {
    res.status(500).send(e.message);
  }
});
