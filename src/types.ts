export type OutreachStatus = 
  | 'New' 
  | 'Contacted' 
  | 'Quote Sent' 
  | 'Follow Up' 
  | 'Booked' 
  | 'Not Interested';

export type Priority = 'High' | 'Medium' | 'Standard';

export interface MovingLead {
  id: string;
  fullName: string;
  phone?: string;
  email: string;
  currentAddress: string;
  city: string;
  state: string;
  zipCode: string;
  destinationCity: string;
  destinationState: string;
  residenceType: 'Studio' | '1 Bed Apt' | '2 Bed Apt' | '3 Bed House' | '4+ Bed House' | 'Townhouse' | 'Condo';
  sqFt: number;
  bedrooms: number;
  moveDate: string; // YYYY-MM-DD
  urgency: Priority;
  status: OutreachStatus;
  estimatedTruckSize: string;
  notes: string;
  estimatedValue: number;
}

export interface LeadFilter {
  search: string;
  zipCodePrefix: string;
  state: string;
  status: string;
  minSqFt: number | null;
  maxSqFt: number | null;
  moveDate: string;
  sortBy: keyof MovingLead;
  sortOrder: 'asc' | 'desc';
}
