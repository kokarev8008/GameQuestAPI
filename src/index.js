import express from "express";
import questRouter from "./routers/questRouter.js";

const PORT = 3000;
const hostName = "127.0.0.1";

const app = express();
app.use(express.json());
app.use(questRouter);

app.listen(PORT, hostName, () => console.log("server started on: http://" + hostName + ":" + PORT));