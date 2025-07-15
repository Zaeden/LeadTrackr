import express from "express";
import { authenticateToken } from "../middlewares/auth";
import LeadController from "../controllers/lead.controller";
import InteractionController from "../controllers/interaction.controller";
import { upload } from "../config/multerConfig";
import FollowUpsController from "../controllers/followUps.controller";

const leadRouter = express.Router();

//Lead related APIs.

leadRouter.get("/", authenticateToken, LeadController.getAllLeads);

leadRouter.get("/:id", authenticateToken, LeadController.getLeadById);

leadRouter.post("/", authenticateToken, LeadController.createLead);

leadRouter.put("/:id", authenticateToken, LeadController.updateLead);

// Update lead status
leadRouter.patch(
  "/:id/status",
  authenticateToken,
  LeadController.updateLeadStatus
);

// Update lead assignedTo field
leadRouter.patch(
  "/:id/assigned",
  authenticateToken,
  LeadController.updateLeadAssignedTo
);

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

// Follow-up related APIs.

leadRouter.post(
  "/:id/follow-ups",
  authenticateToken,
  FollowUpsController.createLeadFollowUp
);

leadRouter.get(
  "/:id/follow-ups",
  authenticateToken,
  FollowUpsController.getLeadFollowUps
);

export default leadRouter;
