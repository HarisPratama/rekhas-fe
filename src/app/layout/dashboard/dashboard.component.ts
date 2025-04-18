import {Component, OnInit} from '@angular/core';
import { RouterModule} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {SplitButtonModule} from 'primeng/splitbutton';
import {MenuItem} from 'primeng/api';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {FormsModule} from '@angular/forms';
import {MenubarModule} from 'primeng/menubar';

@Component({
  selector: 'app-dashboard',
  imports: [MenubarModule, RouterModule, ButtonModule, FormsModule, ToggleButtonModule, SplitButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  items: MenuItem[];
  navs: MenuItem[];
  checked = false;

  constructor() {
    this.items = [
      {
        label: 'Cart',
        icon: 'pi pi-shopping-cart',
        routerLink: ['/cart']
      },
      { separator: true },
      { label: 'Logout', command: () => {} }
    ];
    this.navs = [
      {
        label: 'Stock',
        icon: 'pi pi-box',
        routerLink: ['/stock']
      },
      {
        label: 'Order',
        icon: 'pi pi-shop',
        routerLink: ['/order']
      },
      {
        label: 'Invoice',
        icon: 'pi pi-receipt',
        routerLink: ['/invoice']
      },
      {
        label: 'Delivery',
        icon: 'pi pi-truck',
        routerLink: ['/delivery']
      },
      {
        label: 'Product',
        icon: 'pi pi-objects-column',
        routerLink: ['/product']
      },
      {
        label: 'Workshop',
        icon: 'pi pi-briefcase',
        routerLink: ['/workshop']
      },
    ]
  }

  ngOnInit() {

  }

  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList?.toggle('my-app-dark');
  }
}
