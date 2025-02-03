import { Request, Response } from "express";
import { handleError } from "../utils/handleError.utils";
import prisma from "../db/db.config";
import { ZodError } from "zod";
import { followUpSchema } from "../validations/followUps.validation";

class FollowUpsController {
  // Create a new follow up for a lead.
  static async createLeadFollowUp(req: Request, res: Response): Promise<void> {
    const leadId = parseInt(req.params.id, 10);
    const { id: userId } = req.user;
    try {
      const payload = followUpSchema.parse(req.body);
      const newFollowUp = await prisma.followUp.create({
        data: {
          followUpDate: new Date(payload.followUpDate),
          notes: payload.notes,
          leadId: leadId,
          assignedToId: userId,
        },
      });
      res.status(201).json({
        success: true,
        message: "Follow-up scheduled successfully.",
        followUp: newFollowUp,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res
          .status(400)
          .json({ message: error.errors.map((err) => err.message) });
        return;
      } else {
        handleError(error, res);
      }
    }
  }

  // Fetch all the follow ups for a specific lead by its id.
  static async getLeadFollowUps(req: Request, res: Response): Promise<void> {
    const leadId = parseInt(req.params.id, 10);
    try {
      const existingLead = await prisma.lead.findUnique({
        where: {
          id: leadId,
        },
      });

      if (!existingLead) {
        res.status(404).json({
          success: false,
          message: "Lead not found.",
        });
        return;
      }

      const followUps = await prisma.followUp.findMany({
        where: {
          leadId: leadId,
        },
        include: {
          assignedTo: true,
        },
      });
      res.status(200).json({ success: true, message: "Successful", followUps });
    } catch (error) {
      handleError(error, res);
    }
  }

  // Fetch all the follow ups of a specific user by its id.
  static async getUserFollowUps(req: Request, res: Response): Promise<void> {
    const userId = parseInt(req.params.id, 10);
    try {
      const existingUser = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!existingUser) {
        res.status(404).json({
          success: false,
          message: "User not found.",
        });
        return;
      }

      const followUps = await prisma.followUp.findMany({
        where: {
          assignedToId: userId,
        },
        include: {
          lead: true,
        },
      });
      res.status(200).json({ success: true, message: "Successful", followUps });
    } catch (error) {
      handleError(error, res);
    }
  }

  // Fetch all the follow ups.
  static async getFollowUps(req: Request, res: Response): Promise<void> {
    const { completed, date } = req.query;
    const { role, id: userId } = req.user;
    try {
      const filter: any = {};

      if (completed) {
        filter.isCompleted = completed === "true";
      }
      if (date) {
        filter.followUpDate = new Date(date as string);
      }

      // Restrict to assigned user if not an admin
      if (role !== "ADMIN") {
        filter.assignedToId = userId;
      }
      const followUps = await prisma.followUp.findMany({
        where: filter,
        include: {
          lead: true,
          assignedTo: true,
        },
      });
      res.status(200).json({
        success: true,
        message: "Follow up fetched successfully",
        followUps,
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  // Mark the follow up as completed.
  static async markFollowUpCompleted(
    req: Request,
    res: Response
  ): Promise<void> {
    const followUpId = parseInt(req.params.id, 10);
    try {
      const existingFollowUp = await prisma.followUp.findUnique({
        where: {
          id: followUpId,
        },
      });

      if (!existingFollowUp) {
        res.status(404).json({
          success: false,
          message: "Follow up not found.",
        });
        return;
      }

      const updatedFollowUp = await prisma.followUp.update({
        where: {
          id: followUpId,
        },
        data: {
          isCompleted: true,
        },
      });
      res.status(200).json({
        success: true,
        message: "Follow up marked as completed",
        followUp: updatedFollowUp,
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  // Update an existing follow.
  static async updateFollowUp(req: Request, res: Response): Promise<void> {
    const followUpId = parseInt(req.params.id, 10);

    try {
      const payload = followUpSchema.parse(req.body);

      const existingFollowUp = await prisma.followUp.findUnique({
        where: {
          id: followUpId,
        },
      });

      if (!existingFollowUp) {
        res.status(404).json({
          success: false,
          message: "Follow up not found.",
        });
        return;
      }

      const updatedFollowUp = await prisma.followUp.update({
        where: {
          id: followUpId,
        },
        data: {
          followUpDate: payload.followUpDate
            ? new Date(payload.followUpDate)
            : undefined,
          notes: payload.notes,
        },
      });
      res.status(200).json({
        success: true,
        message: "Follow up updated successfully",
        followUp: updatedFollowUp,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res
          .status(400)
          .json({ message: error.errors.map((err) => err.message) });
        return;
      } else {
        handleError(error, res);
      }
    }
  }

  // Delete an existing follow up.
  static async deleteFollowUp(req: Request, res: Response): Promise<void> {
    const followUpId = parseInt(req.params.id, 10);
    try {
      const existingFollowUp = await prisma.followUp.findUnique({
        where: {
          id: followUpId,
        },
      });

      if (!existingFollowUp) {
        res.status(404).json({
          success: false,
          message: "Follow up not found.",
        });
        return;
      }

      const deletedFollowUp = await prisma.followUp.delete({
        where: {
          id: followUpId,
        },
      });
      res.status(200).json({
        success: true,
        message: "Follow up deleted successfully",
        followUp: deletedFollowUp,
      });
    } catch (error) {
      handleError(error, res);
    }
  }
}

export default FollowUpsController;
