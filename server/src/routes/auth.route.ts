import express from "express";
import AuthController from "../controllers/auth.controller";
import { authenticateToken } from "../middlewares/auth";

const authRouter = express.Router();

authRouter.post("/register", AuthController.register);

authRouter.post("/login", AuthController.login);

authRouter.get(
  "/validate-token",
  authenticateToken,
  AuthController.validateToken
);

authRouter.post("/logout", AuthController.logout);

export default authRouter;
