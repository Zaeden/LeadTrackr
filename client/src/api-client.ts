import { AddCourseFormType } from "./components/forms/AddCourse";
import { AddUserFormType } from "./components/forms/AddUser";
import { FollowUpFormType } from "./components/ui/lead/AddFollowUpModal";
import { LoginFormData } from "./pages/auth/Login";
import { CourseQueryParams } from "./types/CourseType";
import { InteractionTypes } from "./types/InteractionTypes";
import { GetAllLeadsParams, LeadStatusType, LeadType } from "./types/LeadType";
import { GetAllUsersParams } from "./types/UserType";

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
export const getAllUsers = async (params: GetAllUsersParams = {}) => {
  const queryParams = new URLSearchParams();

  if (params.search) queryParams.append("search", params.search);
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.status) queryParams.append("status", params.status);
  if (params.role) queryParams.append("role", params.role);

  const response = await fetch(
    `${API_BASE_URL}/api/users?${queryParams.toString()}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message || "Failed to fetch users.");
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
export const getAllCourses = async (params: CourseQueryParams) => {
  const query = new URLSearchParams();

  if (params.search) query.append("search", params.search);
  if (params.page) query.append("page", params.page.toString());
  if (params.limit) query.append("limit", params.limit.toString());
  if (params.level) query.append("level", params.level);
  if (params.status) query.append("status", params.status);

  const response = await fetch(
    `${API_BASE_URL}/api/courses?${query.toString()}`,
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
export const getAllLeads = async ({
  page = 1,
  limit = 10,
  search = "",
  status,
  source,
  priority,
}: GetAllLeadsParams = {}) => {
  const queryParams = new URLSearchParams();

  queryParams.append("page", page.toString());
  queryParams.append("limit", limit.toString());
  queryParams.append("search", search);

  if (status) queryParams.append("status", status);
  if (source) queryParams.append("source", source);
  if (priority) queryParams.append("priority", priority);

  const response = await fetch(
    `${API_BASE_URL}/api/leads?${queryParams.toString()}`,
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

//Fetches a specific lead data.
export const getLead = async (leadId: number) => {
  const response = await fetch(`${API_BASE_URL}/api/leads/${leadId}`, {
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

// Updates exising lead data in the database.
export const updateLead = async (leadId: number | null, formData: LeadType) => {
  const response = await fetch(`${API_BASE_URL}/api/leads/${leadId}`, {
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

// Updates existing lead status in the database.
export const updateLeadStatus = async (
  leadId: number,
  status: LeadStatusType
) => {
  const response = await fetch(`${API_BASE_URL}/api/leads/${leadId}/status`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message || "Failed to update lead");
  }

  return responseBody;
};

// Updates existing lead assignedTo in the database.
export const updateLeadAssignedTo = async (
  leadId: number,
  assignedTo: number
) => {
  const response = await fetch(`${API_BASE_URL}/api/leads/${leadId}/assigned`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ assignedTo }),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message || "Failed to update lead");
  }

  return responseBody;
};

// Profile Image upload for an existing lead.
export const profileImageUpload = async (
  leadId: number,
  formData: FormData
) => {
  const response = await fetch(
    `${API_BASE_URL}/api/leads/${leadId}/upload-profile-image`,
    {
      method: "PATCH",
      credentials: "include",
      body: formData,
    }
  );

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody;
};

// Adds new lead interaction data to the database.
export const createInteraction = async (
  leadId: number,
  formData: InteractionTypes
) => {
  const response = await fetch(
    `${API_BASE_URL}/api/leads/${leadId}/interactions`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }
  );

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody;
};

//Fetches interactions of a lead.
export const getInteractions = async (leadId: number) => {
  const response = await fetch(
    `${API_BASE_URL}/api/leads/${leadId}/interactions`,
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

//Fetches all the follow ups.
export const getAllFollowUps = async () => {
  const response = await fetch(`${API_BASE_URL}/api/follow-ups`, {
    method: "GET",
    credentials: "include",
  });
  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody;
};

//Fetches all the follow ups for a specific lead.
export const getLeadFollowUps = async (leadId: number) => {
  const response = await fetch(
    `${API_BASE_URL}/api/leads/${leadId}/follow-ups`,
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

// Adds new lead follow up to the database.
export const createLeadFollowUp = async (
  leadId: number,
  formData: FollowUpFormType
) => {
  const response = await fetch(
    `${API_BASE_URL}/api/leads/${leadId}/follow-ups`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }
  );

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody;
};

// Fetch data for dashboard.
export const getDashboardStats = async () => {
  const response = await fetch(`${API_BASE_URL}/api/dashboard`, {
    method: "GET",
    credentials: "include",
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody;
};
