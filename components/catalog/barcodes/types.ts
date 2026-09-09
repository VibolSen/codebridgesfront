export interface BarcodeProductItem {
  id: string;
  name: string;
  price: number | string;
  sku?: string;
  printQty: number;
}
