import { Request, Response } from "express";
import prisma from "../db/db.config";
import { handleError } from "../utils/handleError.utils";
import { userSchema } from "../validations/user.validation";
import { hashPassword } from "../utils/password.utils";
import { ZodError } from "zod";

class UserController {
  // Get all the users details
  static async getAllUsers(req: Request, res: Response): Promise<any> {
    try {
      const users = await prisma.user.findMany();
      if (users.length === 0) {
        return res.status(404).json({ message: "No users found." });
      }
      return res
        .status(200)
        .json({ success: true, message: "Users fetched successfully", users });
    } catch (error) {
      return handleError(error, res);
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
      const payload = userSchema.parse(body);

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
    const { body } = req;
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

      const payload = userSchema.parse(body);

      const updatedUser = await prisma.user.update({
        where: {
          id,
        },
        data: {
          ...payload,
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
