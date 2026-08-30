export type ProductSortBy = 'relevance' | 'price_asc' | 'price_desc' | 'newest';

export interface ProductSearchCriteria {
  query?: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sortBy?: ProductSortBy;
  limit?: number;
  offset?: number;
}
