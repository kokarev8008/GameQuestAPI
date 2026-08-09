import express from "express";
import dbRoute from "./dbRoute.js";

const app = express();

app.use(express.json());
app.use(dbRoute);

export default app;