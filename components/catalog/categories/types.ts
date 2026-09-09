export interface CategoryItem {
  id: number;
  name: string;
  slug?: string;
  parent_id?: number | null;
  parent_name?: string;
  products_count?: number;
}

export interface CategoryFormData {
  name: string;
  parent_id: string;
}
