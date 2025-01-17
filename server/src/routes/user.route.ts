import express from "express";
import { authenticateToken } from "../middlewares/auth";
import { isAdmin } from "../middlewares/role.middleware";
import UserController from "../controllers/user.controller";
import FollowUpsController from "../controllers/followUps.controller";

const userRouter = express.Router();

userRouter.get("/", authenticateToken, isAdmin, UserController.getAllUsers);

userRouter.get("/:id", authenticateToken, isAdmin, UserController.getUserById);

userRouter.post("/", authenticateToken, isAdmin, UserController.createUser);

userRouter.put("/:id", authenticateToken, isAdmin, UserController.updateUser);

userRouter.patch(
  "/:id/deactivate",
  authenticateToken,
  isAdmin,
  UserController.deactivateUser
);

// Follow Ups related routes.

userRouter.get(
  "/:id/follow-ups",
  authenticateToken,
  FollowUpsController.getUserFollowUps
);

export default userRouter;
