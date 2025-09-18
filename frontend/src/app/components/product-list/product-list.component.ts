import { Component, Input, signal, computed } from '@angular/core';
import { Product, ProductSearchResult } from '../../models/product.model';

type SortDirection = 'asc' | 'desc' | '';
type SortableColumn = 'ProductID' | 'Name' | 'ProductNumber' | 'Color' | 'ListPrice' | 'Size' | 'Weight' | 'SellStartDate' | '';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html'
})
export class ProductListComponent {
  // Private signals
  private _searchResult = signal<ProductSearchResult | null>(null);
  private _loading = signal<boolean>(false);
  private _sortColumn = signal<SortableColumn>('');
  private _sortDirection = signal<SortDirection>('');

  // Input setters
  @Input() set searchResult(value: ProductSearchResult | null) {
    this._searchResult.set(value);
  }
  @Input() set loading(value: boolean) {
    this._loading.set(value);
  }

  // Readonly signals for template access
  readonly loadingSignal = this._loading.asReadonly();
  readonly searchResultSignal = this._searchResult.asReadonly();

  // Computed signals
  hasResults = computed(() => (this._searchResult()?.products.length ?? 0) > 0);
  totalCount = computed(() => this._searchResult()?.totalCount || 0);
  
  // Sorted products
  products = computed(() => {
    const products = this._searchResult()?.products || [];
    const sortColumn = this._sortColumn();
    const sortDirection = this._sortDirection();
    
    if (!sortColumn || !sortDirection) {
      return products;
    }
    
    return [...products].sort((a, b) => {
      let aValue: any = a[sortColumn];
      let bValue: any = b[sortColumn];
      
      // Handle null/undefined values
      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';
      
      // Convert to strings for comparison if needed
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  });

  onSort(column: SortableColumn): void {
    const currentColumn = this._sortColumn();
    const currentDirection = this._sortDirection();
    
    if (currentColumn === column) {
      // Cycle through: asc -> desc -> '' -> asc
      if (currentDirection === 'asc') {
        this._sortDirection.set('desc');
      } else if (currentDirection === 'desc') {
        this._sortDirection.set('');
        this._sortColumn.set('');
      } else {
        this._sortDirection.set('asc');
      }
    } else {
      // New column, start with ascending
      this._sortColumn.set(column);
      this._sortDirection.set('asc');
    }
  }

  getSortIcon(column: SortableColumn): string {
    const currentColumn = this._sortColumn();
    const currentDirection = this._sortDirection();
    
    if (currentColumn !== column) {
      return 'bi-arrow-down-up'; // Default sort icon
    }
    
    return currentDirection === 'asc' ? 'bi-arrow-up' : 
           currentDirection === 'desc' ? 'bi-arrow-down' : 'bi-arrow-down-up';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getStatusClass(product: Product): string {
    if (product.DiscontinuedDate) {
      return 'text-danger';
    }
    if (product.SellEndDate && new Date(product.SellEndDate) < new Date()) {
      return 'text-warning';
    }
    return 'text-success';
  }

  getStatusText(product: Product): string {
    if (product.DiscontinuedDate) {
      return 'Discontinued';
    }
    if (product.SellEndDate && new Date(product.SellEndDate) < new Date()) {
      return 'End of Life';
    }
    return 'Active';
  }
}
