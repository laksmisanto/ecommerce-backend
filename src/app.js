import express from "express";
import corse from "cors";
const app = express();

app.use(express.json({ limit: "16KB" }));
app.use(express.urlencoded({ extended: true, limit: "16KB" }));
app.use(corse({ origin: process.env.CORSE_ORIGIN }));

export default app;
