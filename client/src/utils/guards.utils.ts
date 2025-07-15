import { LeadStatusType } from "../types/LeadType";

export const isLeadStatusType = (value: any): value is LeadStatusType => {
  return [
    "NEW",
    "CONTACTED",
    "QUALIFIED",
    "IN_PROGRESS",
    "COMPLETED",
    "LOST",
  ].includes(value);
};
