import { Request, Response } from "express";
import prisma from "../db/db.config";
import { handleError } from "../utils/handleError.utils";
import { updateUserSchema, userSchema } from "../validations/user.validation";
import { hashPassword } from "../utils/password.utils";
import { ZodError } from "zod";
import { Prisma, Role } from "@prisma/client";

class UserController {
  // Get all the users details
  static async getAllUsers(req: Request, res: Response): Promise<void> {
    const { page = 1, limit = 10, search = "", role, status } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * pageSize;
    const trimmedSearch = (search as string).trim();

    try {
      const whereClause: any = {};

      if (trimmedSearch) {
        whereClause.OR = [
          {
            firstName: {
              contains: trimmedSearch,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            lastName: {
              contains: trimmedSearch,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            email: {
              contains: trimmedSearch,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            phone: {
              contains: trimmedSearch,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ];
      }

      if (role) {
        whereClause.role = role;
      }

      if (status) {
        if (status === "ACTIVE") whereClause.isActive = true;
        else if (status === "INACTIVE") whereClause.isActive = false;
      }

      const [users, totalUsers] = await Promise.all([
        prisma.user.findMany({
          where: whereClause,
          skip,
          take: pageSize,
          orderBy: { createdAt: "desc" },
        }),
        prisma.user.count({ where: whereClause }),
      ]);

      res.status(200).json({
        success: true,
        users,
        pagination: {
          currentPage: pageNumber,
          totalPages: Math.ceil(totalUsers / pageSize),
          totalUsers,
        },
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  //Get details of a specific user by id
  static async getUserById(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id);
    try {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });
      if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }
      res.status(200).json({
        success: true,
        message: "User details fetched successfully",
        user,
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  // Create a new user
  static async createUser(req: Request, res: Response): Promise<void> {
    const { body } = req;

    try {
      const trimmedBody = Object.fromEntries(
        Object.entries(body).map(([key, value]) => {
          return [key, typeof value === "string" ? value.trim() : value];
        })
      );

      const payload = userSchema.parse(trimmedBody);

      const existingUser = await prisma.user.findUnique({
        where: { email: payload.email },
      });

      if (existingUser) {
        res.status(400).json({ message: "User already exists" });
        return;
      }

      // Hash the password

      const hashedPassword = await hashPassword(payload.password);

      const newUser = await prisma.user.create({
        data: {
          ...payload,
          password: hashedPassword,
          isActive: true,
        },
      });

      res
        .status(201)
        .json({ success: true, message: "User created successfully" });
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

  // Update an existing user
  static async updateUser(req: Request, res: Response): Promise<void> {
    const body = req.body;
    const id: number = parseInt(req.params.id, 10);
    try {
      const existingUser = await prisma.user.findFirst({
        where: { id },
      });

      if (!existingUser) {
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

      const payload = updateUserSchema.parse(trimmedBody);

      const updatedUser = await prisma.user.update({
        where: {
          id,
        },
        data: {
          ...payload,
          password: existingUser.password,
        },
      });

      res.status(200).json({
        success: true,
        message: "User updated successfully",
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

  // Deactivate an existing user
  static async deactivateUser(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id, 10);
    try {
      const existingUser = await prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        res.status(404).json({
          success: false,
          message: "User not found.",
        });
        return;
      }

      const updatedUser = await prisma.user.update({
        where: {
          id,
        },
        data: {
          isActive: false,
        },
      });
      res.status(200).json({
        success: true,
        message: "User successfully deactivated",
      });
    } catch (error) {
      handleError(error, res);
    }
  }
}

export default UserController;
