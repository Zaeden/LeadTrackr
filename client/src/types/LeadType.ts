import { leadStatus } from "../data/dropDownData";

export type LeadType = {
  id: number;
  firstName: string;
  lastName?: string;
  profilePic?: string;
  email?: string;
  phone: string;
  gender: "MALE" | "FEMALE";
  dob: string;
  courseId: number | null;
  course: {
    id: number;
    name: string;
    level: "DIPLOMA" | "BACHELORS" | "MASTERS" | "DOCTORATE";
  };
  assignedTo: number;
  assignedUser: {
    id: number;
    firstName: string;
    lastName: string;
  };
  createdByUser: {
    id: number;
    firstName: string;
    lastName: string;
  };
  createdBy: number;
  status:
    | "NEW"
    | "CONTACTED"
    | "QUALIFIED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "LOST";
  isActive: boolean;
  source:
    | "WEBSITE"
    | "REFERRAL"
    | "EVENT"
    | "ADVERTISEMENT"
    | "PARTNER"
    | "WALK_IN"
    | "GOOGLE"
    | "FACEBOOK"
    | "INSTAGRAM"
    | "YOUTUBE"
    | "OTHER";
  fatherName: string;
  fatherPhone: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  level: "DIPLOMA" | "BACHELORS" | "MASTERS" | "DOCTORATE";
  createdAt: string;
  updatedAt: string;
};

export interface GetAllLeadsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  source?: string;
  priority?: string;
}

export type LeadStatusType = (typeof leadStatus)[number]["value"];
