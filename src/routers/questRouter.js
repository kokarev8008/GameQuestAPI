import { Router } from "express";
import questController from "../controllers/questController.js";

const router = Router();

router.get("/quest", (req, res) => questController.getQuests(req, res));
router.get("/quest/:id", (req, res) => questController.getQuestById(req, res));

router.post("/quest", (req, res) => questController.createQuest(req, res));

router.patch("/quest/:id", (req, res) => questController.patchQuestById(req, res));

router.delete("/quest/:id", (req, res) => questController.deleteQuestById(req, res));

export default router;