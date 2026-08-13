import { Router } from "express";
import questStatsController from "./questStatsController.js";

const route = Router();

route.get("/quests/stats", (req, res, next) => questStatsController.getStatsAllQuests(req, res, next));

export default route;