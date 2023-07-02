import express from "express";
import validateResource from "../middleware/validateResource";
import { createSessionSchema } from "../schema/auth.schema";
import {
  createSessionHandler,
  // googleOauthHandler,
  refreshAcessTokenHandler,
} from "../controller/auth.controller";

const router = express.Router();

router.post(
  "/api/sessions",
  validateResource(createSessionSchema),
  createSessionHandler
);

router.post("/api/sessions/refresh", refreshAcessTokenHandler);

// router.get("/api/sessions/oauth/google", googleOauthHandler);

export default router;
