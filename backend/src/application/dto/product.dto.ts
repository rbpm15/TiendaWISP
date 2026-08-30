export interface ProductDto {
  id: string;
  sku: string;
  name: string;
  description: string;
  categoryId: string;
  brandId: string | null;
  price: number;
  currency: string;
  isActive: boolean;
}
