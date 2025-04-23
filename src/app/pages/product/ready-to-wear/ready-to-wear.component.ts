import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule, DecimalPipe, Location} from '@angular/common';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import {Router} from '@angular/router';
import {DataViewModule} from 'primeng/dataview';
import {ScrollerModule} from 'primeng/scroller';
import {Subject, takeUntil} from 'rxjs';

import {ProductService} from '../../../services/product/product.service';
import {Product} from '../../../models/stock.model';
import {SearchInputComponent} from '../../../components/shared/components/search-input/search-input.component';
import {PaginationReq} from '../../../../shared/models/pagination-req.model';
import {SkeletonModule} from 'primeng/skeleton';


interface LazyEvent {
  first: number;
  last: number;
}

@Component({
  selector: 'app-ready-to-wear',
  imports: [
    CommonModule,
    DecimalPipe,
    SearchInputComponent,
    DataViewModule,
    ScrollerModule,
    InfiniteScrollDirective,
    SkeletonModule
  ],
  templateUrl: './ready-to-wear.component.html',
  styleUrl: './ready-to-wear.component.css'
})
export class ReadyToWearComponent implements OnInit, OnDestroy {

  skeletons = Array.from(Array(10).keys());
  loading = false;
  scrollDisabled = false;
  products: Product[] = [];
  params: PaginationReq = {
    page: 1,
    limit: 10,
    order: '',
    orderBy: '',
    search: '',
    type: 'READY-TO-WEAR'
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
    this.router.navigate(['product/ready-to-wear/' + id]);
  }


}
