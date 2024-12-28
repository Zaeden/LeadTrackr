import express from "express";
import { authenticateToken } from "../middlewares/auth";
import { isAdmin } from "../middlewares/role.middleware";
import UserController from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.get("/", authenticateToken, isAdmin, UserController.getAllUsers);

userRouter.get("/:id", authenticateToken, isAdmin, UserController.getUserById);

userRouter.post("/", authenticateToken, isAdmin, UserController.createUser);

userRouter.put(
  "/users/:id",
  authenticateToken,
  isAdmin,
  UserController.updateUser
);

userRouter.patch(
  "/users/:id/deactivate",
  authenticateToken,
  isAdmin,
  UserController.deactivateUser
);

export default userRouter;
