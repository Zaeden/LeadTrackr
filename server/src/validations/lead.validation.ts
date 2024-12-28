import { z } from "zod";
import { LeadStatus } from "@prisma/client";

export const leadSchema = z.object({
  firstName: z.string().min(1, { message: "First Name is required" }),
  lastName: z.string().optional(),
  email: z.string().min(1, { message: "Email is required" }).email(),
  phone: z.string().min(10).max(10),
  courseId: z.number(),
});

export const updateLeadSchema = leadSchema.extend({
  status: z.enum([
    LeadStatus.NEW,
    LeadStatus.IN_PROGRESS,
    LeadStatus.COMPLETED,
    LeadStatus.CLOSED,
  ]),
});
