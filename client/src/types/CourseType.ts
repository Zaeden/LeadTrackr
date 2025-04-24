export type CourseType = {
  id: number;
  name: string;
  level: "DIPLOMA" | "BACHELORS" | "MASTERS" | "DOCTORATE";
  isActive: boolean;
  createdAt: string;
};

export type CourseQueryParams = {
  search?: string;
  page?: number;
  limit?: number;
  level?: string;
  status?: string;
};
