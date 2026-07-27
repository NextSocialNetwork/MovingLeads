import { MovingLead } from '../types';

export function maskAddress(address: string | undefined): string {
  if (!address) return '***';
  const trimmed = address.trim();
  const match = trimmed.match(/^(\d+[\w-]*)\s+(.*)$/);
  if (match) {
    const houseNum = match[1];
    const rest = match[2];
    const cleanRest = rest.replace(/\s+/g, ' ');
    const threeChars = cleanRest.slice(0, 3);
    return `${houseNum} ${threeChars}***`;
  }
  const threeChars = trimmed.slice(0, 3);
  return `${threeChars}***`;
}

export function maskEmail(email: string | undefined): string {
  if (!email) return '•••••@••••.com';
  const parts = email.split('@');
  if (parts.length !== 2) return '•••••@••••.com';
  const user = parts[0];
  const domain = parts[1];
  const maskedUser = user.length > 2 ? `${user[0]}***${user[user.length - 1]}` : `${user[0]}***`;
  return `${maskedUser}@${domain} (Protected)`;
}

export function convertLeadsToCSV(leads: MovingLead[]): string {
  const headers = [
    'Lead ID',
    'Full Name',
    'Email (Protected)',
    'Current Address (Protected)',
    'City',
    'State',
    'ZIP Code',
    'Destination City',
    'Destination State',
    'Residence Type',
    'Approx Sq Ft',
    'Bedrooms',
    'Potential Move Date',
    'Urgency',
    'Outreach Status',
    'Est Truck Size',
    'Est Value ($)',
    'Notes'
  ];

  const escapeCSV = (val: string | number | undefined | null): string => {
    if (val === undefined || val === null) return '""';
    const str = String(val);
    // Escape quotes by doubling them
    return `"${str.replace(/"/g, '""')}"`;
  };

  const rows = leads.map((lead) => [
    escapeCSV(lead.id),
    escapeCSV(lead.fullName),
    escapeCSV(maskEmail(lead.email)),
    escapeCSV(maskAddress(lead.currentAddress)),
    escapeCSV(lead.city),
    escapeCSV(lead.state),
    escapeCSV(lead.zipCode),
    escapeCSV(lead.destinationCity),
    escapeCSV(lead.destinationState),
    escapeCSV(lead.residenceType),
    escapeCSV(lead.sqFt),
    escapeCSV(lead.bedrooms),
    escapeCSV(lead.moveDate),
    escapeCSV(lead.urgency),
    escapeCSV(lead.status),
    escapeCSV(lead.estimatedTruckSize),
    escapeCSV(lead.estimatedValue),
    escapeCSV(lead.notes)
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
}

export function downloadCSV(csvContent: string, filename = 'moving_leads_next_week.csv') {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
