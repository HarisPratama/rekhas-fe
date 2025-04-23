import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DecimalPipe} from "@angular/common";
import {InfiniteScrollDirective} from "ngx-infinite-scroll";
import {Skeleton} from "primeng/skeleton";
import {Product} from '../../../models/stock.model';

@Component({
  selector: 'app-product-grid',
    imports: [
        DecimalPipe,
        InfiniteScrollDirective,
        Skeleton
    ],
  templateUrl: './product-grid.component.html',
  styleUrl: './product-grid.component.css'
})
export class ProductGridComponent {
  @Input() products: Product[] = [];
  @Input() scrollDisabled = false;
  @Input() loading = false;
  @Output() onScroll = new EventEmitter();
  @Output() goToDetail = new EventEmitter();

  skeletons = Array.from(Array(10).keys());
}
