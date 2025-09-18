import { Component, OnInit, signal, computed } from '@angular/core';
import { ProductService } from './services/product.service';
import { Product, ProductSearchCriteria, ProductSearchResult } from './models/product.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'AdventureWorks Product Filter';
  
  // Signals for reactive state management
  private _searchResult = signal<ProductSearchResult | null>(null);
  private _loading = signal<boolean>(false);
  private _currentSearchCriteria = signal<ProductSearchCriteria>({});
  private _error = signal<string | null>(null);
  private _isSearchSectionCollapsed = signal<boolean>(true); // Default to collapsed

  // Readonly signals for template access
  searchResult = this._searchResult.asReadonly();
  loading = this._loading.asReadonly();
  currentSearchCriteria = this._currentSearchCriteria.asReadonly();
  error = this._error.asReadonly();
  isSearchSectionCollapsed = this._isSearchSectionCollapsed.asReadonly();

  // Computed signals
  hasResults = computed(() => (this._searchResult()?.products.length ?? 0) > 0);
  totalProducts = computed(() => this._searchResult()?.totalCount || 0);

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(criteria?: ProductSearchCriteria): void {
    this._loading.set(true);
    this._error.set(null);
    this._currentSearchCriteria.set(criteria || {});
    
    this.productService.getAllProducts(criteria).subscribe({
      next: (result) => {
        this._searchResult.set(result);
        this._loading.set(false);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this._error.set('Failed to load products. Please try again.');
        this._loading.set(false);
      }
    });
  }

  onSearch(criteria: ProductSearchCriteria): void {
    this.loadProducts(criteria);
  }

  onClearSearch(): void {
    this.loadProducts();
  }

  showSearchSection(): void {
    this._isSearchSectionCollapsed.set(false); // Show search section when button is clicked
  }

  onHideSearch(): void {
    this._isSearchSectionCollapsed.set(true);
  }
}
