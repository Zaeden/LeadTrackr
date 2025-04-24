export type UserType = {
  id: number;
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
};

export type GetAllUsersParams = {
  search?: string;
  page?: number;
  limit?: number;
  status?: string;
  role?: string;
};
