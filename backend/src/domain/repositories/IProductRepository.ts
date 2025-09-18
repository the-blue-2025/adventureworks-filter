import { Product } from '../entities/Product';

export interface ProductSearchCriteria {
  name?: string;
  productNumber?: string;
  color?: string;
  productLine?: string;
  class?: string;
  style?: string;
  size?: string;
  page?: number;
  limit?: number;
}

export interface ProductSearchResult {
  products: Product[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface IProductRepository {
  findAll(criteria?: ProductSearchCriteria): Promise<ProductSearchResult>;
  findById(id: number): Promise<Product | null>;
  search(criteria: ProductSearchCriteria): Promise<ProductSearchResult>;
}
