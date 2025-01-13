import { InteractionType } from "@prisma/client";
import { z } from "zod";

export const interactionSchema = z.object({
  interactionType: z.enum([
    InteractionType.CALL,
    InteractionType.EMAIL,
    InteractionType.OTHER,
    InteractionType.VIDEO_CALL,
    InteractionType.WALK_IN,
  ]),
  notes: z.string().max(300, "Notes cannot exceed 500 characters").optional(),
});
