import { Router } from "express";
import questStatsController from "./questStatsController.js";

const route = Router();

route.get("/quests", (req, res) => questStatsController.getQuests(req, res));
route.get("/quests/:id", (req, res) => questStatsController.getQuestById(req, res));

export default route;