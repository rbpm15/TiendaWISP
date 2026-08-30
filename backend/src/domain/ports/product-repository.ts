import type { Product } from '../entities/product.js';
import type { ProductSearchCriteria } from '../value-objects/product-search-criteria.js';

export interface ProductRepository {
  findById(id: string): Promise<Product | null>;
  search(criteria: ProductSearchCriteria): Promise<Product[]>;
  save(product: Product): Promise<Product>;
  delete(id: string): Promise<void>;
}
