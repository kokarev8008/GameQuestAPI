import express from "express";
import dbRoute from "./dbRoute.js";
import { ErrorModule } from "../err/ErrorModule.js";

const app = express();

app.use(express.json());
app.use(dbRoute);
app.use(ErrorModule.errorHandlerMidlleware);

export default app;