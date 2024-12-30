import { CourseLevel } from "@prisma/client";
import { z } from "zod";

export const courseSchema = z.object({
  name: z.string().min(1, { message: "First Name is required" }),
  level: z.enum(
    [
      CourseLevel.DIPLOMA,
      CourseLevel.BACHELORS,
      CourseLevel.MASTERS,
      CourseLevel.DOCTORATE,
    ],
    {
      message: "Course Level is required",
    }
  ),
});

export const updateCourseSchema = courseSchema;
