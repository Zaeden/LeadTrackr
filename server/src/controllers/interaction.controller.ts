import { Request, Response } from "express";
import { handleError } from "../utils/handleError.utils";
import prisma from "../db/db.config";
import { interactionSchema } from "../validations/interaction.validation";
import { ZodError } from "zod";

class InteractionController {
  static async getLeadInteraction(req: Request, res: Response): Promise<void> {
    const leadId = parseInt(req.params.id, 10);
    try {
      const interactions = await prisma.interactionLog.findMany({
        where: { leadId },
        include: {
          interactionBy: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          interactionTime: "desc",
        },
      });

      res.status(200).json({ success: true, message: "Success", interactions });
      return;
    } catch (error) {
      handleError(error, res);
    }
  }

  static async createLeadInteraction(
    req: Request,
    res: Response
  ): Promise<void> {
    const leadId = parseInt(req.params.id, 10);
    const { id: userId } = req.user;
    try {
      const payload = interactionSchema.parse(req.body);
      const newInteraction = await prisma.interactionLog.create({
        data: {
          ...payload,
          leadId,
          interactionById: userId,
        },
      });
      res.status(201).json({
        success: true,
        message: "Interaction created",
        interaction: newInteraction,
      });
      return;
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
}

export default InteractionController;
