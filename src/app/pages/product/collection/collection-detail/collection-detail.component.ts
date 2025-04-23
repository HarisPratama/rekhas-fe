import {Component, OnInit} from '@angular/core';
import {Button, ButtonModule} from "primeng/button";
import {Card, CardModule} from "primeng/card";
import {Carousel, CarouselModule} from "primeng/carousel";
import {DecimalPipe, Location} from "@angular/common";
import {Divider, DividerModule} from "primeng/divider";
import {Skeleton, SkeletonModule} from "primeng/skeleton";
import {Tag, TagModule} from "primeng/tag";
import {ProductService} from '../../../../services/product/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Dialog, DialogModule} from 'primeng/dialog';
import {SelectModule} from 'primeng/select';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-collection-detail',
  imports: [
    ButtonModule,
    CardModule,
    CarouselModule,
    DecimalPipe,
    DividerModule,
    SkeletonModule,
    TagModule,
    DialogModule,
    SelectModule,
    FormsModule
  ],
  templateUrl: './collection-detail.component.html',
  styleUrl: './collection-detail.component.css'
})
export class CollectionDetailComponent implements OnInit {
  visible = false;
  productId: string | null = null;
  product: any = null;
  responsiveOptions: any[] | undefined;
  loading : boolean = true;
  category = ''
  categories = ['SHIRT', 'SUIT', 'TROUSER']

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
    this.router.navigate(
      ['/product/size-measure/' + Number(this.productId)],
      { queryParams: {category: this.category} }
    );
  }
}
