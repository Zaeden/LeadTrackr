import { Response } from "express";

export const handleError = (error: any, res: Response) => {
  if (error instanceof Error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
