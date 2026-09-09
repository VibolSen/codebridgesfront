export interface RestaurantTableItem {
  id: string;
  name: string;
  zone: string;
  capacity: number;
  status: 'vacant' | 'occupied' | 'bill_requested' | string;
}
