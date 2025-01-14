import express, { Request, Response, NextFunction } from "express";
import { authenticateToken } from "../middlewares/auth";
import LeadController from "../controllers/lead.controller";
import InteractionController from "../controllers/interaction.controller";
import { upload } from "../config/multerConfig";

const leadRouter = express.Router();

//Lead related APIs.

leadRouter.get("/", authenticateToken, LeadController.getAllLeads);

leadRouter.get("/:id", authenticateToken, LeadController.getLeadById);

leadRouter.post("/", authenticateToken, LeadController.createLead);

leadRouter.put("/:id", authenticateToken, LeadController.updateLead);

leadRouter.patch(
  "/:id/deactivate",
  authenticateToken,
  LeadController.deactivateLead
);

leadRouter.patch(
  "/:id/upload-profile-image",
  authenticateToken,

  upload.single("profilePic"),
  LeadController.uploadProfile
);

//Interaction related APIs

leadRouter.get(
  "/:id/interactions",
  authenticateToken,
  InteractionController.getLeadInteraction
);

leadRouter.post(
  "/:id/interactions",
  authenticateToken,
  InteractionController.createLeadInteraction
);

export default leadRouter;
