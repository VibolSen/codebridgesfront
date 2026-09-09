export interface SupportTicket {
  id: string;
  tenantName: string;
  requester: string;
  subject: string;
  priority: 'urgent' | 'high' | 'normal';
  status: 'open' | 'in_progress' | 'resolved';
  category: string;
  createdAt: string;
}

export const SAMPLE_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-8821',
    tenantName: 'Amazon Cafe (BKK1)',
    requester: 'Sokha Meng (Owner)',
    subject: 'Need help connecting NBC Bakong KHQR dynamic webhook callback',
    priority: 'high',
    status: 'open',
    category: 'Payment Integration',
    createdAt: '12 mins ago',
  },
  {
    id: 'TCK-8820',
    tenantName: 'Brown Coffee Toul Kork',
    requester: 'Channary Voeun (Manager)',
    subject: 'How to export monthly double-entry general ledger to CSV for tax audit',
    priority: 'normal',
    status: 'in_progress',
    category: 'Accounting & Reports',
    createdAt: '2 hours ago',
  },
  {
    id: 'TCK-8819',
    tenantName: 'Tube Coffee Riverside',
    requester: 'Dara Chan',
    subject: 'Request quota increase to add 3rd kitchen display KDS terminal',
    priority: 'normal',
    status: 'resolved',
    category: 'Subscription Quotas',
    createdAt: '1 day ago',
  },
];
