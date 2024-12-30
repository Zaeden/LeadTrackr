export type CourseType = {
  id: number;
  name: string;
  level: "DIPLOMA" | "BACHELORS" | "MASTERS" | "DOCTORATE";
  isActive: boolean;
  createdAt: string;
};
