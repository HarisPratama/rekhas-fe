import {Component, Input} from '@angular/core';
import {DialogModule} from 'primeng/dialog';
import {DecimalPipe} from '@angular/common';
import {Product} from '../../../models/stock.model';
import {ButtonModule} from 'primeng/button';
import {Router} from '@angular/router';
import {Cart} from '../../../services/cart/shared/interface/cart.interface';

@Component({
  selector: 'app-add-to-cart-modal',
  imports: [DialogModule, DecimalPipe, ButtonModule],
  templateUrl: './add-to-cart-modal.component.html',
  styleUrl: './add-to-cart-modal.component.css'
})
export class AddToCartModalComponent {
  @Input() visible = false;

  @Input() product: Product | null = null

  cart: any = null;

  constructor(private router: Router) {
  }

  viewCart() {
    this.router.navigate(['/cart']);
  }

  checkout() {
    if(this.cart?.id) this.router.navigate(['/order-summary', this.cart.id]);
  }
}
