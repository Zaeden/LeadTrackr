import express from "express";
import { authenticateToken } from "../middlewares/auth";
import LeadController from "../controllers/lead.controller";

const leadRouter = express.Router();

leadRouter.get("/", authenticateToken, LeadController.getAllLeads);

leadRouter.get("/:id", authenticateToken, LeadController.getAllLeads);

leadRouter.post("/", authenticateToken, LeadController.createLead);

leadRouter.put("/:id", authenticateToken, LeadController.updateLead);

leadRouter.patch(
  "/:id/deactivate",
  authenticateToken,
  LeadController.deactivateLead
);

export default leadRouter;
