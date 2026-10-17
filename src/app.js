import express from "express";
import { ErrorModule } from "./err/ErrorModule.js";

const {default: questRouter} = await import("./routers/questRouter.js");

const app = express();
app.use(express.json());
app.use(questRouter);
app.use((req, res, next) => ErrorModule.errorRouteNotFoundMiddleware(req, res, next));
app.use((err, req, res, next) => ErrorModule.errorHandlerMidlleware(err, req, res, next));

export default app;