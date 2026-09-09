export interface BrandItem {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  products_count?: number;
}

export interface BrandFormData {
  name: string;
  description: string;
}
