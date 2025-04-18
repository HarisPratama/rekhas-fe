import {Component, OnInit} from '@angular/core';
import {DecimalPipe, Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../../../services/product/product.service';
import {CarouselModule} from 'primeng/carousel';
import {TagModule} from 'primeng/tag';
import {SkeletonModule} from 'primeng/skeleton';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {DividerModule} from 'primeng/divider';

@Component({
  selector: 'app-ready-to-wear-detail',
  imports: [DecimalPipe, CarouselModule, TagModule, SkeletonModule, CardModule, ButtonModule, DividerModule],
  templateUrl: './ready-to-wear-detail.component.html',
  styleUrl: './ready-to-wear-detail.component.css'
})
export class ReadyToWearDetailComponent implements OnInit {
  productId: string | null = null;
  product: any = null;
  responsiveOptions: any[] | undefined;
  loading : boolean = true;

  constructor(private location: Location, public productService: ProductService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    console.log('Product ID:', this.productId);
    if (this.productId) {
      this.productService.getProductDetail(Number(this.productId));
      this.productService.product.subscribe(product => {
        this.product = product;
        if (this.product?.fabric) {
          this.loading = false;
        }
      })
    }

    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1
      },
      {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1
      }
    ]
  }

  goBack() {
    this.location.back();
  }

  startMeasure() {
    this.router.navigate(['/product/size-measure/' + Number(this.productId)]);
  }
}
