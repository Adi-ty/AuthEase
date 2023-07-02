import express from "express";
import user from "./user.routes";
import auth from "./auth.routes";

const router = express.Router();

router.get("/", (_, res) =>
  res.status(200).json({ message: "Welcome to AuthEase API" })
);
router.use(user);
router.use(auth);

export default router;
