import { z } from "zod";
import { Gender, LeadPriority, LeadSource, LeadStatus } from "@prisma/client";

const leadSourceEnum = Object.values(LeadSource) as [string, ...string[]];

export const leadSchema = z.object({
  firstName: z.string().min(1, { message: "First Name is required" }),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).max(10),
  gender: z.enum([Gender.MALE, Gender.FEMALE]),
  courseId: z.number().optional(),
  dob: z
    .string()
    .refine(
      (date) => !isNaN(new Date(date).getTime()),
      "Date of birth must be a valid date string."
    ),
  source: z.enum(leadSourceEnum),
  fatherName: z.string().optional(),
  fatherPhone: z.string().optional(),
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  priority: z.enum([LeadPriority.LOW, LeadPriority.MEDIUM, LeadPriority.HIGH]),
});

const leadStatusEnum = Object.values(LeadStatus) as [string, ...string[]];

export const updateLeadSchema = leadSchema.extend({
  status: z.enum(leadStatusEnum),
});

export const partialUpdateLeadSchema = z.object({
  status: z.nativeEnum(LeadStatus).optional(),
  assignedTo: z.number().optional(),
});
