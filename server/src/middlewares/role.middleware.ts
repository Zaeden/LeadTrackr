import { Request, Response, NextFunction } from "express";

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const { role } = req.user;

  if (role !== "ADMIN") {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }
  next();
};
