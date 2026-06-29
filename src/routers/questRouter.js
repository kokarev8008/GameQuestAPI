import { Router } from "express";
import dataBodyValidService from "../validation/body/DataBodyQuestValidService.js";
import questController from "../controllers/questController.js";

const router = Router();

router.get("/quests", (req, res) => questController.getQuests(req, res));
router.get("/quests/:id", 
    (req, res, next) => dataBodyValidService.idValidMiddleware(req, res, next), 
    (req, res) => questController.getQuestById(req, res));

router.post("/quests", 
    (req, res, next) => dataBodyValidService.postInspector(req, res, next),
    (req, res) => questController.createQuest(req, res));

router.patch("/quests/:id", 
    (req, res, next) => dataBodyValidService.idValidMiddleware(req, res, next),
    (req, res, next) => dataBodyValidService.patchInspector(req, res, next),
    (req, res) => questController.patchQuestById(req, res));

router.delete("/quests/:id", 
    (req, res, next) => dataBodyValidService.idValidMiddleware(req, res, next),
    (req, res) => questController.deleteQuestById(req, res));
 
export default router;