import express from "express";
import questRouter from "./routers/questRouter.js";
import { ErrorModule } from "./err/ErrorModule.js";

const PORT = 3000;
const hostName = "127.0.0.1";

const app = express();
app.use(express.json());
app.use(questRouter);
app.use((err, req, res, next) => ErrorModule.errorHandlerMidlleware(err, req, res, next));

app.listen(PORT, hostName, () => console.log("server started on: http://" + hostName + ":" + PORT));