import express from 'express';
import { createActor, getAllActors, getActorById, updateActor, deleteActor } from "../controller/actorController.js";

const router = express.Router();

router.post("/", createActor);
router.get("/", getAllActors);
router.get("/:id", getActorById);
router.put("/:id", updateActor);
router.delete("/:id", deleteActor);

export default router;
