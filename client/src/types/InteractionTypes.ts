export type InteractionTypes = {
  id: number;
  leadId: number;
  interactionBy: {
    firstName: string;
    lastName: string;
  };
  interactionType: string;
  interactionTime: string;
  notes?: string;
};
