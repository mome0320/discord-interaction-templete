import express from "express";
import { handleRequest } from "./bot";
import dotenv from 'dotenv';
import { verifyKeyMiddleware } from "discord-interactions";

dotenv.config();
const app = express();

app.post(
  "/interaction/discord",
  verifyKeyMiddleware(process.env.DISCORD_INTERACTIONS_KEY),
  (req, res) =>
    handleRequest(req).then((result) =>
      res.status(result.HTTPStatus).json(result.data)
    )
);
  app.listen(process.env.PORT || 80, () => console.log("Ready."));
