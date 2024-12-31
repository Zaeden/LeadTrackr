import express from "express";
import { authenticateToken } from "../middlewares/auth";
import { isAdmin } from "../middlewares/role.middleware";
import CourseController from "../controllers/course.controller";

const courseRouter = express.Router();

courseRouter.get(
  "/",
  authenticateToken,
  isAdmin,
  CourseController.getAllCourses
);

courseRouter.get(
  "/levels",
  authenticateToken,
  CourseController.getAllCoursesByLevel
);

courseRouter.get(
  "/:id",
  authenticateToken,
  isAdmin,
  CourseController.getCourseById
);

courseRouter.post(
  "/",
  authenticateToken,
  isAdmin,
  CourseController.createCourse
);

courseRouter.put(
  "/:id",
  authenticateToken,
  isAdmin,
  CourseController.updateCourse
);

courseRouter.patch(
  "/:id/deactivate",
  authenticateToken,
  isAdmin,
  CourseController.deactivateCourse
);

export default courseRouter;
