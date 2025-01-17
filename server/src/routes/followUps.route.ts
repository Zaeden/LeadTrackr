import express from "express";
import { authenticateToken } from "../middlewares/auth";
import FollowUpsController from "../controllers/followUps.controller";
import { isAdmin } from "../middlewares/role.middleware";

const followUpRouter = express.Router();

followUpRouter.get(
  "/",
  authenticateToken,
  isAdmin,
  FollowUpsController.getFollowUps
);

followUpRouter.patch(
  "/:id/mark-complete",
  authenticateToken,
  FollowUpsController.markFollowUpCompleted
);

followUpRouter.put(
  "/:id",
  authenticateToken,
  FollowUpsController.updateFollowUp
);

followUpRouter.delete(
  "/:id",
  authenticateToken,
  FollowUpsController.deleteFollowUp
);

export default followUpRouter;
