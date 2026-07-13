import express from "express";
import { ErrorModule } from "./err/ErrorModule.js";
import path from "node:path";

process.env.DATA_PATH = process.env.DATA_FILE_PATH || path.join(process.cwd(), "src", "data.json");

const {default: questRouter} = await import("./routers/questRouter.js");

const app = express();
app.use(express.json());
app.use(questRouter);
app.use((req, res, next) => ErrorModule.errorRouteNotFoundMiddleware(req, res, next));
app.use((err, req, res, next) => ErrorModule.errorHandlerMidlleware(err, req, res, next));

export default app;