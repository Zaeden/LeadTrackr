import { Request, Response } from "express";
import { loginSchema, registerSchema } from "../validations/auth.validation";
import { ZodError } from "zod";
import prisma from "../db/db.config";
import { comparePassword, hashPassword } from "../utils/password.utils";
import { generateToken } from "../utils/token.utils";
import { handleError } from "../utils/handleError.utils";

class AuthController {
  static async register(req: Request, res: Response): Promise<any> {
    try {
      const { body } = req;
      const payload = registerSchema.parse(body);

      const existingUser = await prisma.user.findUnique({
        where: {
          email: payload.email,
        },
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "User already exists" });
      }

      // Hash the Password.
      const hashedPassword = await hashPassword(payload.password);

      const newUser = await prisma.user.create({
        data: {
          ...payload,
          password: hashedPassword,
          isActive: true,
        },
      });

      return res.status(201).json({ message: "Registration Successful" });
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(500)
          .json({ message: error.errors.map((err) => err.message) });
      } else {
        handleError(error, res);
      }
    }
  }

  static async login(req: Request, res: Response): Promise<any> {
    try {
      const { body } = req;

      const payload = loginSchema.parse(body);

      const user = await prisma.user.findUnique({
        where: { email: payload.email },
      });

      if (!user)
        return res.status(400).json({ message: "Invalid Credentials" });

      if (!user.isActive) {
        return res.status(403).json({ message: "You are unauthorized" });
      }

      const isPasswordMatching = await comparePassword(
        payload.password,
        user.password
      );

      // check if password is matching with the password in the database.
      if (!isPasswordMatching)
        return res
          .status(400)
          .json({ success: false, message: "Invalid Credentials" });

      // generate a token.

      const token = generateToken({ id: user.id, role: user.role });

      // send a cookie.
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: true,
        maxAge: parseInt(process.env.COOKIE_MAX_AGE as string, 10),
      });

      return res
        .status(201)
        .json({ message: "Login Successful", userId: user.id });
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(500)
          .json({ message: error.errors.map((err) => err.message) });
      } else {
        handleError(error, res);
      }
    }
  }

  static async validateToken(req: Request, res: Response): Promise<any> {
    try {
      return res.status(201).json({ userId: req.user.id, role: req.user });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  static async logout(req: Request, res: Response): Promise<any> {
    try {
      res.cookie("auth_token", "", {
        expires: new Date(0),
      });
      res.json({ message: "User Logged Out" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}

export default AuthController;
