export type AnalyticsTimeRange = '24h' | '7d' | '30d' | '90d' | '1y';

export interface ModuleAdoptionMetric {
  name: string;
  count: string;
  adoption: number;
  color: string;
}
