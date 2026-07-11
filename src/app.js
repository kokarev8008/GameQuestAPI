import express from "express";
import questRouter from "./routers/questRouter.js";
import { ErrorModule } from "./err/ErrorModule.js";
import path from "node:path";

process.env.DATA_FILE_PATH = path.join("src", "tests", "fixtures", "quests.initial.json");

const app = express();
app.use(express.json());
app.use(questRouter);
app.use((req, res, next) => ErrorModule.errorRouteNotFoundMiddleware(req, res, next));
app.use((err, req, res, next) => ErrorModule.errorHandlerMidlleware(err, req, res, next));

export default app;