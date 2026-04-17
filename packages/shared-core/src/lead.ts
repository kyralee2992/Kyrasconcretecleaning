export type LeadStatus =
  | 'new'
  | 'quoted'
  | 'accepted'
  | 'rejected'
  | 'expired';

export interface Lead {
  id: string;
  address: string;
  requestedService: string;
  status: LeadStatus;
  createdAt: string;
}
