import express from "express";
import DashboardController from "../controllers/dashboard.controller";
import { authenticateToken } from "../middlewares/auth";

const dashboardRouter = express.Router();

dashboardRouter.get(
  "/",
  authenticateToken,
  DashboardController.getDashboardStats
);

export default dashboardRouter;
