import { Component } from '@angular/core';
import {Router, RouterModule} from '@angular/router';

export interface ProductItem {
  title: string;
  description: string;
  image: string;
  route: string;
}

export const PRODUCTS: ProductItem[] = [
  {
    title: 'Collection',
    description: 'Select our very own collection',
    image: 'assets/images/collection-banner.png',
    route: '/collection',
  },
  {
    title: 'Alter',
    description: 'Alter your style with the best',
    image: 'assets/images/alter-banner.png',
    route: '/alter',
  },
  {
    title: 'Simulation',
    description: 'Select our materials, measure size, and prepare for delivery!',
    image: 'assets/images/simulation-banner.png',
    route: '/simulation',
  },
  {
    title: 'Ready To Wear',
    description: 'Select our very own creation and wear them in style!',
    image: 'assets/images/ready-to-wear-banner.png',
    route: '/ready-to-wear',
  }
];


@Component({
  selector: 'app-product',
  imports: [RouterModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  products: ProductItem[] = PRODUCTS;

  constructor(private router: Router) {
  }

  isOnRootRoute(): boolean {
    return this.router.url === '/product';
  }

  goTo(route: string) {
    this.router.navigate(['product/' + route]);
  }
}
