import { Request, Response } from "express";
import prisma from "../db/db.config";
import { handleError } from "../utils/handleError.utils";
import { ZodError } from "zod";
import { CourseLevel, Prisma } from "@prisma/client";
import {
  courseSchema,
  updateCourseSchema,
} from "../validations/course.validation";

class CourseController {
  // Get all the course details
  static async getAllCourses(req: Request, res: Response): Promise<any> {
    const { page = 1, limit = 10, search = "", level, status } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);

    try {
      const whereClause: any = {
        AND: [],
      };

      // Search filter
      if (search) {
        whereClause.AND.push({
          OR: [
            {
              name: {
                contains: search as string,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        });
      }

      // Level filter
      if (level) {
        whereClause.AND.push({
          level: level as CourseLevel,
        });
      }

      // isActive filter
      if (status) {
        if (status === "ACTIVE") {
          whereClause.AND.push({ isActive: true });
        } else if (status === "INACTIVE") {
          whereClause.AND.push({ isActive: false });
        }
      }

      // If no filters, use an empty object
      const finalWhereClause = whereClause.AND.length > 0 ? whereClause : {};

      const totalCourses = await prisma.course.count({
        where: finalWhereClause,
      });

      const courses = await prisma.course.findMany({
        where: finalWhereClause,
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
      });

      if (courses.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No Courses found.",
          courses: [],
          totalCourses: 0,
          totalPages: 0,
          currentPage: pageNumber,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Courses fetched successfully",
        courses,
        totalCourses,
        totalPages: Math.ceil(totalCourses / pageSize),
        currentPage: pageNumber,
      });
    } catch (error) {
      return handleError(error, res);
    }
  }

  //Get details of a specific course by id
  static async getCourseById(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id);
    try {
      const course = await prisma.course.findUnique({
        where: {
          id,
        },
      });
      if (!course) {
        res.status(404).json({ success: false, message: "Course not found" });
        return;
      }
      res.status(200).json({
        success: true,
        message: "Course details fetched successfully",
        course,
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  //Get details of all courses by level
  static async getAllCoursesByLevel(
    req: Request,
    res: Response
  ): Promise<void> {
    const { level } = req.query;
    if (!level) {
      res.status(400).json({ message: "Level parameter is required" });
      return;
    }
    try {
      const courses = await prisma.course.findMany({
        where: {
          level: level as CourseLevel,
        },
      });

      if (courses.length === 0) {
        res.status(404).json({ message: "No courses found for this level" });
        return;
      }
      res.status(200).json({
        success: true,
        message: "Courses fetched successfully",
        courses,
      });
      return;
    } catch (error) {
      handleError(error, res);
    }
  }

  // Create a new course
  static async createCourse(req: Request, res: Response): Promise<void> {
    const { body } = req;

    try {
      const trimmedBody = Object.fromEntries(
        Object.entries(body).map(([key, value]) => {
          return [key, typeof value === "string" ? value.trim() : value];
        })
      );

      const payload = courseSchema.parse(trimmedBody);

      const existingCourse = await prisma.course.findUnique({
        where: { name: payload.name },
      });

      if (existingCourse) {
        res.status(400).json({ message: "Course already exists" });
        return;
      }

      const newCourse = await prisma.course.create({
        data: {
          ...payload,
          isActive: true,
        },
      });

      res
        .status(201)
        .json({ success: true, message: "Course created successfully" });
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

  // Update an existing course
  static async updateCourse(req: Request, res: Response): Promise<void> {
    const body = req.body;
    const id: number = parseInt(req.params.id, 10);
    try {
      const existingCourse = await prisma.course.findFirst({
        where: { id },
      });

      if (!existingCourse) {
        res.status(404).json({
          success: false,
          message: "User not found.",
        });
        return;
      }

      const trimmedBody = Object.fromEntries(
        Object.entries(body).map(([key, value]) => {
          return [key, typeof value === "string" ? value.trim() : value];
        })
      );

      const payload = updateCourseSchema.parse(trimmedBody);

      const updatedCourse = await prisma.course.update({
        where: {
          id,
        },
        data: {
          ...payload,
        },
      });

      res.status(200).json({
        success: true,
        message: "Course updated successfully",
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

  // Deactivate an existing course
  static async deactivateCourse(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id, 10);
    try {
      const existingCourse = await prisma.course.findUnique({
        where: { id },
      });

      if (!existingCourse) {
        res.status(404).json({
          success: false,
          message: "Course not found.",
        });
        return;
      }

      const updatedCourse = await prisma.course.update({
        where: {
          id,
        },
        data: {
          isActive: false,
        },
      });
      res.status(200).json({
        success: true,
        message: "Course successfully deactivated",
      });
    } catch (error) {
      handleError(error, res);
    }
  }
}

export default CourseController;
