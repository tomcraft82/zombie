import express, { Request, Response } from "express";
import * as ZombieItemService from "./zombie_item.service";
import { ZombieItem } from "./zombie_item.entity";

export const zombieItemsRouter = express.Router();

zombieItemsRouter.get("/:id/items", async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    const zombies: ZombieItem[] = await ZombieItemService.getForZombie(id);

    res.status(200).send(zombies);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

zombieItemsRouter.post("/:id/items", async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    const item: ZombieItem = req.body;

    const newItem = await ZombieItemService.add(id, item);

    res.status(201).json(newItem);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

zombieItemsRouter.put("/:zombieId/items/:itemId", async (req: Request, res: Response) => {
  const itemId: number = parseInt(req.params.itemId, 10);

  try {
    const zombieItemToUpdate: ZombieItem = req.body;

    const updatedZombie = await ZombieItemService.update(itemId, zombieItemToUpdate);
    return res.status(200).json(updatedZombie);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

zombieItemsRouter.delete("/:zombieId/items/:itemId", async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.itemId, 10);
    await ZombieItemService.remove(id);

    res.sendStatus(204);
  } catch (e) {
    res.status(500).send(e.message);
  }
});
