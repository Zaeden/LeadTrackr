import { z } from "zod";

export const followUpSchema = z.object({
  followUpDate: z
    .string()
    .refine(
      (date) => !isNaN(new Date(date).getTime()),
      "FollowUpDate must be a valid date string."
    ),
  notes: z.string().optional(),
});
