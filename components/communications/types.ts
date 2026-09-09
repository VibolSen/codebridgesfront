export interface Broadcast {
  id: string;
  title: string;
  type: 'announcement' | 'maintenance' | 'release_notes';
  content: string;
  status: 'published' | 'scheduled' | 'draft';
  targetAudience: string;
  publishedAt: string;
}

export const SAMPLE_BROADCASTS: Broadcast[] = [
  {
    id: 'BRD-01',
    title: 'New Feature: Multi-Currency USD & KHR Denomination Bill Counter',
    type: 'release_notes',
    content: 'Cashiers can now physically count USD and KHR cash drawer bills with instant blended calculation at 4,100 ៛/USD.',
    status: 'published',
    targetAudience: 'All Active Tenants',
    publishedAt: 'Today, 2:00 PM',
  },
  {
    id: 'BRD-02',
    title: 'Scheduled System Maintenance: NBC Bakong KHQR Gateway Upgrade',
    type: 'maintenance',
    content: 'Routine security patching and latency optimization on Sunday 02:00 AM - 03:00 AM GMT+7. Card and Cash payments remain fully operational.',
    status: 'scheduled',
    targetAudience: 'All Merchants',
    publishedAt: 'Upcoming Sunday',
  },
];
