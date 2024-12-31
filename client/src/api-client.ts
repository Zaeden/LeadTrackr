import { AddCourseFormType } from "./components/forms/AddCourse";
import { AddUserFormType } from "./components/forms/AddUser";
import { LoginFormData } from "./pages/auth/Login";
import { LeadType } from "./types/LeadType";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const login = async (formData: LoginFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody;
};

// Validates the token
export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Token invalid");
  }
  return response.json();
};

// Logout the user
export const logoutUser = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody;
};

//Fetches all user data.
export const getAllUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/api/users/`, {
    method: "GET",
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody;
};

//Fetches a specific user data.
export const getUser = async (userId: number) => {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
    method: "GET",
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody;
};

// Adds new user data to the database.
export const createUser = async (formData: AddUserFormType) => {
  const response = await fetch(`${API_BASE_URL}/api/users/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody;
};

// Updates exising user data in the database.
export const updateUser = async (
  userId: number | null,
  formData: AddUserFormType
) => {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody;
};

// Deactivates an exising user data in the database.
export const deleteUser = async (userId: number | null) => {
  const response = await fetch(
    `${API_BASE_URL}/api/users/${userId}/deactivate`,
    {
      method: "PATCH",
      credentials: "include",
    }
  );

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody;
};

//Fetches all courses data.
export const getAllCourses = async () => {
  const response = await fetch(`${API_BASE_URL}/api/courses/`, {
    method: "GET",
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody;
};

//Fetches all courses data by level
export const getAllCoursesByLevel = async (level: string) => {
  const response = await fetch(
    `${API_BASE_URL}/api/courses/levels/?level=${level}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody;
};

//Fetches a specific user data.
export const getCourse = async (courseId: number) => {
  const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}`, {
    method: "GET",
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody;
};

// Adds new course data to the database.
export const createCourse = async (formData: AddCourseFormType) => {
  const response = await fetch(`${API_BASE_URL}/api/courses/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody;
};

// Updates exising course data in the database.
export const updateCourse = async (
  courseId: number | null,
  formData: AddCourseFormType
) => {
  const response = await fetch(`${API_BASE_URL}/api/courses/${courseId}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody;
};

// Deactivates an exising user data in the database.
export const deleteCourse = async (courseId: number | null) => {
  const response = await fetch(
    `${API_BASE_URL}/api/courses/${courseId}/deactivate`,
    {
      method: "PATCH",
      credentials: "include",
    }
  );

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody;
};

//Fetches all leads data.
export const getAllLeads = async () => {
  const response = await fetch(`${API_BASE_URL}/api/leads/`, {
    method: "GET",
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody;
};

// Adds new lead data to the database.
export const createLead = async (formData: LeadType) => {
  const response = await fetch(`${API_BASE_URL}/api/leads/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody;
};
