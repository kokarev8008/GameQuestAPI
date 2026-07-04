import { Router } from "express";
import dataBodyValidService from "../validation/body/DataBodyQuestValidService.js";
import questController from "../controllers/questController.js";

const router = Router();

router.get("/quests", (req, res, next) => questController.getQuests(req, res, next));
router.get("/quests/:id", 
    (req, res, next) => dataBodyValidService.idValidMiddleware(req, res, next), 
    (req, res, next) => questController.getQuestById(req, res, next));

router.post("/quests", 
    (req, res, next) => dataBodyValidService.postInspector(req, res, next),
    (req, res, next) => questController.createQuest(req, res, next));

router.patch("/quests/:id", 
    (req, res, next) => dataBodyValidService.idValidMiddleware(req, res, next),
    (req, res, next) => dataBodyValidService.patchInspector(req, res, next),
    (req, res, next) => questController.patchQuestById(req, res, next));

router.delete("/quests/:id", 
    (req, res, next) => dataBodyValidService.idValidMiddleware(req, res, next),
    (req, res, next) => questController.deleteQuestById(req, res, next));

export default router;