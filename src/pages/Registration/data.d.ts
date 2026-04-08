export type RegistrationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface HistoryLog {
  adminName: string;
  action: RegistrationStatus;
  time: string;
  reason?: string;
}

export interface RegistrationItem {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  talent: string;
  clubId: string;
  clubName: string;
  reason: string;
  status: RegistrationStatus;
  note?: string;
  history: HistoryLog[];
}