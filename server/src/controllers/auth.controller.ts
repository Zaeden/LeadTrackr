import { Request, Response } from "express";
import { loginSchema, registerSchema } from "../validations/auth.validation";
import { ZodError } from "zod";
import prisma from "../db/db.config";
import { comparePassword, hashPassword } from "../utils/password.utils";
import { generateToken } from "../utils/token.utils";

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
        return res.status(400).json({ message: "User already exists" });
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
        return res.status(500).json({ message: error });
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

      const isPasswordMatching = await comparePassword(
        payload.password,
        user.password
      );

      // check if password is matching with the password in the database.
      if (!isPasswordMatching)
        return res.status(400).json({ message: "Invalid Credentials" });

      // generate a token.

      const token = generateToken({ id: user.id, role: user.role });

      // send a cookie.
      res.cookie("auth_token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60,
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
        return res.status(500).json({ message: error });
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
      res.send();
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}

export default AuthController;
