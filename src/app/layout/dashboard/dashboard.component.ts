import {Component, OnInit} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {SplitButtonModule} from 'primeng/splitbutton';
import {MenuItem} from 'primeng/api';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {FormsModule} from '@angular/forms';
import {MenubarModule} from 'primeng/menubar';
import {rolePermissions} from '../../const/role-permission';

@Component({
  selector: 'app-dashboard',
  imports: [MenubarModule, RouterModule, ButtonModule, FormsModule, ToggleButtonModule, SplitButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  items: MenuItem[];
  checked = false;

  fullNavs = [
    { label: 'Stock', icon: 'pi pi-box', routerLink: ['/stock'], key: 'stock' },
    { label: 'Order', icon: 'pi pi-shop', routerLink: ['/order'], key: 'order' },
    { label: 'Invoice', icon: 'pi pi-receipt', routerLink: ['/invoice'], key: 'invoice' },
    { label: 'Delivery', icon: 'pi pi-truck', routerLink: ['/delivery'], key: 'delivery' },
    { label: 'Product', icon: 'pi pi-objects-column', routerLink: ['/product'], key: 'product' },
    { label: 'Workshop', icon: 'pi pi-briefcase', routerLink: ['/workshop'], key: 'workshop' },
    { label: 'Checkpoint', icon: 'pi pi-map-marker', routerLink: ['/checkpoint'], key: 'checkpoint' },
    { label: 'Employee', icon: 'pi pi-users', routerLink: ['/employee'], key: 'employee' },
    { label: 'Customer', icon: 'pi pi-heart', routerLink: ['/customer'], key: 'customer' },
  ];

  navs: any[] = [];
  userData: any;

  constructor(private router: Router,) {
    this.items = [
      {
        label: 'Cart',
        icon: 'pi pi-shopping-cart',
        routerLink: ['/cart']
      },
      { separator: true },
      { label: 'Logout',
        command: () => {
          localStorage.clear();
          this.router.navigate(['/login']);
        }
      }
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
      {
        label: 'Checkpoint',
        icon: 'pi pi-map-marker',
        routerLink: ['/checkpoint']
      },
      {
        label: 'Employee',
        icon: 'pi pi-users',
        routerLink: ['/employee']
      },
      {
        label: 'Customer',
        icon: 'pi pi-heart',
        routerLink: ['/customer']
      },
    ]
  }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userData = user;
    const role = user?.role?.name;

    const permissions = rolePermissions[role];

    if (!permissions) {
      this.navs = [];
      return;
    }

    if (permissions.allowed === 'all menu') {
      this.navs = this.fullNavs;
    } else if (permissions.allowed) {
      this.navs = this.fullNavs.filter(nav => permissions.allowed.includes(nav.key));
    } else if (permissions.disallowed) {
      this.navs = this.fullNavs.filter(nav => !permissions.disallowed.includes(nav.key));
    } else {
      this.navs = [];
    }
  }

  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList?.toggle('my-app-dark');
  }
}
