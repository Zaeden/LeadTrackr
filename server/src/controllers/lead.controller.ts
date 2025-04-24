import { Request, Response } from "express";
import prisma from "../db/db.config";
import { handleError } from "../utils/handleError.utils";
import { hashPassword } from "../utils/password.utils";
import { ZodError } from "zod";
import { leadSchema, updateLeadSchema } from "../validations/lead.validation";
import { LeadSource, LeadStatus, Prisma } from "@prisma/client";
import cloudinary from "cloudinary";

class LeadController {
  // Get all the leads details
  static async getAllLeads(req: Request, res: Response): Promise<void> {
    const { id: userId, role } = req.user;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const search = (req.query.search as string)?.trim() || "";

    try {
      let whereClause: any = {};

      if (search) {
        whereClause.OR = [
          {
            firstName: { contains: search, mode: "insensitive" },
          },
          {
            lastName: { contains: search, mode: "insensitive" },
          },
          {
            email: { contains: search, mode: "insensitive" },
          },
          {
            phone: { contains: search, mode: "insensitive" },
          },
        ];
      }

      if (req.query.status) {
        whereClause.status = req.query.status;
      }
      if (req.query.source) {
        whereClause.source = req.query.source;
      }
      if (req.query.priority) {
        whereClause.priority = req.query.priority;
      }

      if (role !== "ADMIN") {
        whereClause.assignedTo = userId;
      }

      const [leads, totalLeads] = await Promise.all([
        prisma.lead.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        prisma.lead.count({
          where: whereClause,
        }),
      ]);

      res.status(200).json({
        success: true,
        leads,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalLeads / limit),
          totalLeads,
        },
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  //Get details of a specific lead by id
  static async getLeadById(req: Request, res: Response): Promise<void> {
    const leadId: number = parseInt(req.params.id);
    try {
      const lead = await prisma.lead.findUnique({
        where: {
          id: leadId,
        },
      });
      if (!lead) {
        res.status(404).json({ success: false, message: "Lead not found" });
        return;
      }
      res.status(200).json({
        success: true,
        message: "Lead details fetched successfully",
        lead,
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  // Create a new user
  static async createLead(req: Request, res: Response): Promise<void> {
    const { body } = req;

    const { id: userId } = req.user;

    try {
      const payload = leadSchema.parse({
        ...body,
        courseId: parseInt(body.courseId, 10),
      });

      const existingLead = await prisma.lead.findFirst({
        where: {
          OR: [{ email: payload.email }, { phone: payload.phone }],
        },
      });

      if (existingLead) {
        res.status(400).json({
          success: false,
          message: "Lead with the same email or phone number already exists",
        });
        return;
      }

      const newLead = await prisma.lead.create({
        data: {
          ...payload,
          dob: new Date(payload.dob),
          assignedTo: userId,
          createdBy: userId,
          status: "NEW",
          isActive: true,
          source: payload.source as LeadSource,
          priority: payload.priority || "MEDIUM",
        },
      });

      res
        .status(201)
        .json({ success: true, message: "Lead created successfully" });
    } catch (error) {
      if (error instanceof ZodError) {
        res
          .status(400)
          .json({ message: error.errors.map((err) => err.message) });
      } else {
        handleError(error, res);
      }
    }
  }

  // Update an existing lead
  static async updateLead(req: Request, res: Response): Promise<void> {
    const { body } = req;
    const leadId: number = parseInt(req.params.id, 10);
    try {
      const existingLead = await prisma.lead.findUnique({
        where: { id: leadId },
      });

      if (!existingLead) {
        res.status(404).json({ success: false, message: "Lead not found." });
        return;
      }

      const payload = updateLeadSchema.parse(body);

      const updatedLead = await prisma.lead.update({
        where: {
          id: leadId,
        },
        data: {
          ...payload,
          dob: new Date(payload.dob),
          source: payload.source as LeadSource,
          status: payload.status as LeadStatus,
        },
      });

      res.status(200).json({
        success: true,
        message: "Lead updated successfully",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: error.errors.map((err) => err.message),
        });
      } else {
        handleError(error, res);
      }
    }
  }

  // Deactivate an existing lead
  static async deactivateLead(req: Request, res: Response): Promise<void> {
    const leadId: number = parseInt(req.params.id, 10);
    try {
      const existingLead = await prisma.lead.findUnique({
        where: { id: leadId },
      });

      if (!existingLead) {
        res.status(404).json({
          success: false,
          message: "Lead not found.",
        });
        return;
      }

      const updateLead = await prisma.lead.update({
        where: {
          id: leadId,
        },
        data: {
          isActive: false,
        },
      });
      res.status(200).json({
        success: true,
        message: "Lead successfully deactivated",
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  // Upload profile image to a lead
  static async uploadProfile(req: Request, res: Response): Promise<void> {
    const leadId: number = parseInt(req.params.id, 10);
    const imageFile = req.file as Express.Multer.File;

    if (!imageFile) {
      res.status(400).json({
        success: false,
        message: "No image file provided.",
      });
      return;
    }

    try {
      const existingLead = await prisma.lead.findUnique({
        where: { id: leadId },
      });

      if (!existingLead) {
        res.status(404).json({
          success: false,
          message: "Lead not found.",
        });
        return;
      }

      const b64 = Buffer.from(imageFile.buffer).toString("base64");
      let dataURI = "data:" + imageFile.mimetype + ";base64," + b64;

      const cldResponse = await cloudinary.v2.uploader.upload(dataURI, {
        folder: "lead-profile-photos",
      });

      const updateLeadProfilePic = await prisma.lead.update({
        where: {
          id: leadId,
        },
        data: {
          profilePic: cldResponse.url,
        },
      });
      res.status(200).json({
        success: true,
        message: "Image upload successfull",
      });
    } catch (error) {
      handleError(error, res);
    }
  }
}

export default LeadController;
