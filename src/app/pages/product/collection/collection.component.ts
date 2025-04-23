import {Component, OnDestroy, OnInit} from '@angular/core';
import {Product} from '../../../models/stock.model';
import {PaginationReq} from '../../../../shared/models/pagination-req.model';
import {Subject, takeUntil} from 'rxjs';
import {CommonModule, Location} from '@angular/common';
import {Router} from '@angular/router';
import {ProductService} from '../../../services/product/product.service';
import {SearchInputComponent} from '../../../components/shared/components/search-input/search-input.component';
import {DataViewModule} from 'primeng/dataview';
import {ScrollerModule} from 'primeng/scroller';
import {SkeletonModule} from 'primeng/skeleton';
import {ProductGridComponent} from '../../../components/global/product-grid/product-grid.component';

@Component({
  selector: 'app-collection',
  imports: [
    CommonModule,
    SearchInputComponent,
    DataViewModule,
    ScrollerModule,
    SkeletonModule,
    ProductGridComponent
  ],
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.css'
})
export class CollectionComponent implements OnInit, OnDestroy {
  loading = false;
  scrollDisabled = false;
  products: Product[] = [];
  params: PaginationReq = {
    page: 1,
    limit: 10,
    order: '',
    orderBy: '',
    search: '',
    type: 'COLLECTION'
  };

  destroy$: Subject<void> = new Subject();
  items!: any[][];

  constructor(private location: Location, private router: Router, public productService: ProductService) {}

  ngOnInit() {
    this.fetchProducts();
    this.productService.products
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => {
          if (data && data.length > 0) {
            this.loading = false;
            this.products = [...this.products, ...data];

            if (data.length < this.params.limit) {
              this.scrollDisabled = true;
            }
          }
        },
        error: () => this.loading = false
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onScroll() {
    if (this.loading) return;

    this.params.page++; // ✅ increment halaman
    this.fetchProducts(); // 🚀 ambil data baru
  }

  fetchProducts() {
    this.loading = true;
    this.productService.getProducts(this.params)
  }

  goBack() {
    this.location.back();
  }

  goToDetail(id:number) {
    this.router.navigate(['product/collection', id]);

  }
}
