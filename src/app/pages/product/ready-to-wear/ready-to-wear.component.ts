import {Component, OnInit} from '@angular/core';
import {DecimalPipe, Location} from '@angular/common';
import {ProductService} from '../../../services/product/product.service';
import {Product} from '../../../models/stock.model';
import {PaginationReq} from '../../../../shared/models/pagination-req.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-ready-to-wear',
  imports: [
    DecimalPipe
  ],
  templateUrl: './ready-to-wear.component.html',
  styleUrl: './ready-to-wear.component.css'
})
export class ReadyToWearComponent implements OnInit {
  constructor(private location: Location, private router: Router, public productService: ProductService) { }

  products: Product[] = [];
  params: PaginationReq = {
    page: 1,
    limit: 5,
    order: '',
    orderBy: '',
    search: '',
    type: 'READY-TO-WEAR'
  };

  ngOnInit() {
    this.productService.getProducts(this.params)
    this.productService.products
    .subscribe(products => {
      this.products = products;
    });
  }

  goBack() {
    this.location.back();
  }

  goToDetail(id:number) {
    this.router.navigate(['product/ready-to-wear/' + id]);
  }

}
